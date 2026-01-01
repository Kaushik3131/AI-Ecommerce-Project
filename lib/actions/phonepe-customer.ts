"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/sanity/queries/customers";

/**
 * Gets or creates a customer in Sanity by email
 * PhonePe version - no Stripe dependency
 */
export async function getOrCreateCustomer(
  email: string,
  name: string,
  clerkUserId: string,
): Promise<string> {
  // Check if customer already exists in Sanity
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  if (existingCustomer) {
    // Customer exists, return ID
    return existingCustomer._id;
  }

  // Create new customer in Sanity
  const newCustomer = await writeClient.create({
    _type: "customer",
    email,
    name,
    clerkUserId,
  });

  return newCustomer._id;
}
