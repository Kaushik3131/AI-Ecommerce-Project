"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";

// PhonePe imports
import { getPhonePeClient } from "@/lib/phonepe/client";
import { StandardCheckoutPayRequest, MetaInfo } from "pg-sdk-node";
import { randomUUID } from "crypto";
import { getOrCreateCustomer } from "@/lib/actions/phonepe-customer";

// Types
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AddressData {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a PhonePe Payment Session from cart items
 * Validates stock and prices against Sanity before creating session
 */
export async function createCheckoutSession(
  items: CartItem[],
  address?: AddressData,
): Promise<CheckoutResult> {
  try {
    // 1. Verify user is authenticated
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Please sign in to checkout" };
    }

    // 2. Validate cart is not empty
    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 3. Fetch current product data from Sanity to validate prices/stock
    const cartProductIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: cartProductIds,
    });

    // 4. Validate each item
    const validationErrors: string[] = [];
    const validatedItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId,
      );

      if (!product) {
        validationErrors.push(`Product "${item.name}" is no longer available`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" is out of stock`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Only ${product.stock} of "${product.name}" available`,
        );
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 5. Calculate total amount for PhonePe (in paise - INR only)
    const totalAmount = validatedItems.reduce(
      (sum, { product, quantity }) => sum + (product.price ?? 0) * quantity,
      0,
    );
    const amountInPaise = Math.round(totalAmount * 100); // Convert to paise

    // 6. Get user details
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    // 7. User details already extracted above

    // 8. Create PhonePe Payment Request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_BASE_URL is not defined. Please set it in .env.local",
      );
    }

    const merchantOrderId = randomUUID();

    // Get or create customer in Sanity
    const customerId = await getOrCreateCustomer(userEmail, userName, userId);

    // Store order metadata in Sanity BEFORE payment
    // This allows webhook to retrieve it later using merchantOrderId
    await writeClient.create({
      _type: "order",
      orderNumber: merchantOrderId,
      clerkUserId: userId,
      email: userEmail,
      customer: {
        _type: "reference",
        _ref: customerId,
      },
      ...(address && {
        address: {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || "",
          city: address.city,
          postcode: address.postcode,
          country: address.country,
        },
      }),
      items: validatedItems.map(({ product, quantity }, index) => ({
        _key: `${product._id}-${Date.now()}-${index}`,
        product: {
          _type: "reference",
          _ref: product._id,
        },
        quantity: quantity,
        priceAtPurchase: product.price ?? 0,
      })),
      total: totalAmount,
      status: "pending", // Will be updated to "paid" by webhook
      paymentStatus: "PENDING",
      createdAt: new Date().toISOString(), // Add creation timestamp
    });

    // Prepare MetaInfo for PhonePe (for tracking & verification)
    // Using first 4 UDF fields for essential data
    const metaInfo = new MetaInfo(
      merchantOrderId, // udf1: Sanity order ID
      userId, // udf2: Clerk user ID
      userEmail, // udf3: Customer email
      amountInPaise.toString(), // udf4: Amount in paise (for verification)
      "", // udf5: Reserved for future use
    );

    const transactionMessage = `Order: ${merchantOrderId} | Customer: ${userName} (${userId})`;

    const paymentRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaise)
      .redirectUrl(`${baseUrl}/checkout/success?orderId=${merchantOrderId}`)
      .metaInfo(metaInfo) // Send metadata to PhonePe
      .expireAfter(3600) // 1 hour expiry
      .message(transactionMessage)
      .build();

    // 9. Initiate payment with PhonePe
    const phonePeClient = getPhonePeClient();
    const response = await phonePeClient.pay(paymentRequest);

    return { success: true, url: response.redirectUrl ?? undefined };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Retrieves order details by merchant order ID (for success page)
 * Fetches from Sanity to show order details even before webhook completes
 */
export async function getCheckoutSession(merchantOrderId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get order from Sanity with all payment details
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $merchantOrderId && clerkUserId == $userId][0]{
        _id,
        orderNumber,
        email,
        total,
        status,
        paymentStatus,
        currency,
        amountPaid,
        phonePeTransactionId,
        phonePeOrderId,
        paymentMethod,
        address,
        items[]{
          _key,
          quantity,
          priceAtPurchase,
          product->{
            _id,
            name,
            price,
            "image": image.asset->url
          }
        },
        createdAt
      }`,
      { merchantOrderId, userId },
    );

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      session: {
        id: order.orderNumber,
        merchantOrderId: order.orderNumber,
        customerEmail: order.email,
        customerName: order.address?.name,
        amountTotal: order.amountPaid || Math.round(order.total * 100), // In paise
        paymentStatus: order.paymentStatus || order.status,
        currency: order.currency || "INR",
        shippingAddress: order.address,
        // Transform items to lineItems format for UI
        lineItems: order.items?.map((item: any) => ({
          name: item.product?.name || "Product",
          quantity: item.quantity,
          amount: Math.round((item.priceAtPurchase || 0) * 100), // In paise
        })),
        // Payment details
        transactionId: order.phonePeTransactionId,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
      },
    };
  } catch (error) {
    console.error("Get order error:", error);
    return { success: false, error: "Could not retrieve order details" };
  }
}
