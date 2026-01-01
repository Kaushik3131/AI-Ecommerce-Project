"use server";

import { writeClient } from "@/sanity/lib/client";

interface AddressData {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

/**
 * Update order with shipping address
 * Called after address is collected from user
 */
export async function updateOrderAddress(
  orderNumber: string,
  addressData: AddressData,
) {
  try {
    // Find the order
    const order = await writeClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber },
    );

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Update order with address
    await writeClient
      .patch(order._id)
      .set({
        address: {
          name: addressData.name,
          line1: addressData.line1,
          line2: addressData.line2 || "",
          city: addressData.city,
          postcode: addressData.postcode,
          country: addressData.country,
        },
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error updating order address:", error);
    return { success: false, error: "Failed to update address" };
  }
}
