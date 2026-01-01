"use server";

import { writeClient } from "@/sanity/lib/client";

/**
 * Manually mark an order as paid (for local testing)
 * In production, this is done by the PhonePe webhook
 *
 * Usage: Call this after successful payment redirect for local testing
 */
export async function markOrderAsPaid(merchantOrderId: string) {
  try {
    // Find the order
    const order = await writeClient.fetch(
      `*[_type == "order" && orderNumber == $merchantOrderId][0]`,
      { merchantOrderId },
    );

    if (!order) {
      console.error("Order not found:", merchantOrderId);
      return { success: false, error: "Order not found" };
    }

    // Check if already paid
    if (order.status === "paid") {
      console.log("Order already paid:", merchantOrderId);
      return { success: true, message: "Order already paid" };
    }

    // Calculate amount in paise for verification
    const amountInPaise = Math.round(order.total * 100);

    // Update order status (Recommended Approach fields)
    await writeClient
      .patch(order._id)
      .set({
        status: "paid",
        paymentStatus: "COMPLETED",
        paymentMethod: "phonepe",
        phonePeOrderId: `local-test-${merchantOrderId}`,
        phonePeTransactionId: `local-txn-${merchantOrderId}`, // For local testing
        currency: "INR",
        amountPaid: amountInPaise, // Amount in paise
      })
      .commit();

    console.log("Order marked as paid:", merchantOrderId);

    // Update product stock
    for (const item of order.items) {
      await writeClient
        .patch(item.product._ref)
        .dec({ stock: item.quantity })
        .commit();
    }

    console.log("Stock updated for order:", merchantOrderId);

    return { success: true, message: "Order marked as paid" };
  } catch (error) {
    console.error("Error marking order as paid:", error);
    return { success: false, error: "Failed to mark order as paid" };
  }
}
