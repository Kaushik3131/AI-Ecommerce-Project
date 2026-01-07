"use server";

import { writeClient } from "@/sanity/lib/client";

/**
 * Auto-cancel pending orders older than 10 minutes
 * Called when admin views orders page
 */
export async function autoCancelOldPendingOrders() {
  try {
    // Calculate cutoff time (10 minutes ago)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    // Find pending orders older than 10 minutes
    const pendingOrders = await writeClient.fetch(
      `*[_type == "order" && status == "pending" && createdAt < $cutoffTime]{
        _id,
        orderNumber,
        createdAt
      }`,
      { cutoffTime: tenMinutesAgo },
    );

    if (!pendingOrders || pendingOrders.length === 0) {
      return { cancelled: 0 };
    }

    // Cancel each pending order
    for (const order of pendingOrders) {
      await writeClient
        .patch(order._id)
        .set({
          status: "cancelled",
          paymentStatus: "CANCELLED",
          cancelledAt: new Date().toISOString(),
          cancellationReason: "Auto-cancelled: Payment timeout (10 minutes)",
          updatedAt: new Date().toISOString(),
        })
        .commit();
    }

    return { cancelled: pendingOrders.length };
  } catch {
    return { cancelled: 0 };
  }
}
