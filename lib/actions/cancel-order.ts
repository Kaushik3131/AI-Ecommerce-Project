"use server";

import { writeClient } from "@/sanity/lib/client";

/**
 * Marks an order as cancelled if it's still in pending status
 * This handles cases where user cancels payment or navigates away
 */
export async function cancelPendingOrder(merchantOrderId: string) {
  try {
    // Find the order
    const order = await writeClient.fetch(
      `*[_type == "order" && orderNumber == $merchantOrderId][0]{
        _id,
        status,
        orderNumber
      }`,
      { merchantOrderId },
    );

    if (!order) {
      console.error("Order not found:", merchantOrderId);
      return { success: false, error: "Order not found" };
    }

    // Only cancel if still pending
    if (order.status !== "pending") {
      console.log("Order already processed:", {
        orderId: merchantOrderId,
        status: order.status,
      });
      return { success: true, alreadyProcessed: true };
    }

    // Mark as cancelled
    await writeClient
      .patch(order._id)
      .set({
        status: "cancelled",
        paymentStatus: "CANCELLED",
        cancelledAt: new Date().toISOString(),
        cancellationReason: "User cancelled payment or navigated away",
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log("Order cancelled:", {
      orderId: merchantOrderId,
      sanityId: order._id,
    });

    return { success: true, cancelled: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}
