import { type NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/phonepe/client";
import { writeClient } from "@/sanity/lib/client";

// PhonePe webhook payload types
interface PhonePeWebhookPayload {
  orderId: string;
  merchantOrderId: string;
  state: string;
  amount: number;
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
  };
  paymentDetails?: Array<{
    transactionId?: string;
    paymentMode?: string;
    errorCode?: string;
    detailedErrorCode?: string;
  }>;
}

/**
 * PhonePe Webhook Handler
 * Handles payment callbacks from PhonePe
 * Events: checkout.order.completed, checkout.order.failed
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Get webhook credentials from environment
    const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME;
    const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD;

    if (!webhookUsername || !webhookPassword) {
      console.error("Webhook credentials not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // 2. Verify webhook signature
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      console.error("Missing authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isValid = verifyWebhookSignature(
      authHeader,
      webhookUsername,
      webhookPassword,
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse webhook payload
    const body = await req.json();
    const { event, payload } = body as {
      event: string;
      payload: PhonePeWebhookPayload;
    };

    console.log("PhonePe webhook received:", {
      event,
      orderId: payload?.orderId,
    });

    // 4. Handle different event types
    console.log("=== PHONEPE WEBHOOK EVENT ===", {
      event,
      state: payload?.state,
      code: payload?.paymentDetails?.[0]?.errorCode,
    });

    switch (event) {
      case "checkout.order.completed":
        await handleOrderCompleted(payload);
        break;

      case "checkout.order.failed":
      case "checkout.order.cancelled": // Handle cancellation explicitly
        await handleOrderFailed(payload);
        break;

      default:
        console.log("Unhandled event type:", event);
        console.log("Full payload:", JSON.stringify(payload, null, 2));
    }

    // 5. Return success response
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Handle successful order completion
 */
async function handleOrderCompleted(payload: PhonePeWebhookPayload) {
  try {
    const { orderId, merchantOrderId, state, amount, paymentDetails } = payload;

    console.log("=== PhonePe Webhook Received ===");
    console.log("Order ID:", orderId);
    console.log("Merchant Order ID:", merchantOrderId);
    console.log("State:", state);
    console.log("Amount:", amount);
    console.log("Payment Details:", JSON.stringify(paymentDetails, null, 2));
    console.log("Full Payload:", JSON.stringify(payload, null, 2));
    console.log("================================");

    // Find the pre-created order by merchantOrderId (orderNumber)
    const existingOrder = await writeClient.fetch(
      `*[_type == "order" && orderNumber == $merchantOrderId][0]`,
      { merchantOrderId },
    );

    if (!existingOrder) {
      console.error("Pre-order not found for:", merchantOrderId);
      return;
    }

    // Check if already processed (idempotency)
    if (existingOrder.phonePeOrderId) {
      console.log("Order already processed:", orderId);
      return;
    }

    // Verify amount matches (recommended approach)
    const expectedAmount = Math.round(existingOrder.total * 100); // Convert to paise
    if (amount !== expectedAmount) {
      console.error("Amount mismatch!", {
        orderId: merchantOrderId,
        expected: expectedAmount,
        received: amount,
      });
      // Continue processing but log the mismatch
    }

    // Update order with payment details (Recommended Approach)
    await writeClient
      .patch(existingOrder._id)
      .set({
        phonePeOrderId: orderId,
        phonePeTransactionId: paymentDetails?.[0]?.transactionId,
        status: "paid",
        paymentStatus: state,
        paymentMethod: paymentDetails?.[0]?.paymentMode || "phonepe",
        currency: "INR",
        amountPaid: amount, // Amount in paise (for verification)
      })
      .commit();

    console.log("Order updated in Sanity:", existingOrder._id);

    // Update product stock
    for (const item of existingOrder.items) {
      await writeClient
        .patch(item.product._ref)
        .dec({ stock: item.quantity })
        .commit();
    }

    console.log("Stock updated for order:", merchantOrderId);
  } catch (error) {
    console.error("Error handling completed order:", error);
    throw error;
  }
}

/**
 * Handle failed order
 */
async function handleOrderFailed(payload: PhonePeWebhookPayload) {
  try {
    const { orderId, merchantOrderId, state, paymentDetails } = payload;

    console.log("Processing failed order:", merchantOrderId);

    // Find the pre-created order by merchantOrderId
    const existingOrder = await writeClient.fetch(
      `*[_type == "order" && orderNumber == $merchantOrderId][0]`,
      { merchantOrderId },
    );

    if (!existingOrder) {
      console.error("Order not found for failed payment:", merchantOrderId);
      return;
    }

    // Update the order to cancelled status
    await writeClient
      .patch(existingOrder._id)
      .set({
        phonePeOrderId: orderId,
        phonePeTransactionId: paymentDetails?.[0]?.transactionId || orderId,
        status: "cancelled",
        paymentStatus: "FAILED",
        paymentMethod: paymentDetails?.[0]?.paymentMode || "unknown",
        failureReason: paymentDetails?.[0]?.errorCode || state,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log("Order marked as cancelled:", {
      orderId,
      merchantOrderId,
      status: "cancelled",
    });
  } catch (error) {
    console.error("Error handling failed order:", error);
    // Don't throw - we don't want to retry failed orders
  }
}
