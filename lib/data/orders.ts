import { client } from "@/sanity/lib/client";

export interface OrderDetail {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  stripePaymentId: string | null;
  phonePeTransactionId: string | null;
  phonePeOrderId: string | null;
  paymentMethod: string | null;
  address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    postcode: string;
    country: string;
  } | null;
  items: Array<{
    _key: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      _id: string;
      name: string;
      slug: string;
      image: {
        asset: {
          url: string;
        } | null;
      } | null;
    } | null;
  }>;
}

const ORDER_PROJECTION = `{
  _id,
  orderNumber,
  email,
  total,
  status,
  createdAt,
  stripePaymentId,
  phonePeTransactionId,
  phonePeOrderId,
  paymentMethod,
  address{
    name,
    line1,
    line2,
    city,
    postcode,
    country
  },
  items[]{
    _key,
    quantity,
    priceAtPurchase,
    product->{
      _id,
      name,
      "slug": slug.current,
      "image": images[0]{
        asset->{
          url
        }
      }
    }
  }
}`;

/**
 * Fetch order data from Sanity (server-side only).
 * Checks for draft first, falls back to published.
 */
export async function getOrderById(
  orderId: string,
): Promise<OrderDetail | null> {
  try {
    const publishedId = orderId.replace("drafts.", "");
    const draftId = `drafts.${publishedId}`;

    // Try to get draft first (for admin preview)
    let order = await client.fetch<OrderDetail>(
      `*[_id == $draftId][0]${ORDER_PROJECTION}`,
      { draftId },
    );

    // If no draft, get published version
    if (!order) {
      order = await client.fetch<OrderDetail>(
        `*[_id == $publishedId][0]${ORDER_PROJECTION}`,
        { publishedId },
      );
    }

    return order;
  } catch (error) {
    console.error("[Get Order Error]:", error);
    return null;
  }
}
