import { client } from "@/sanity/lib/client";

export interface ProductDetail {
  _id: string;
  name: string;
  slug: {
    current: string;
  } | null;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  material: string | null;
  color: string | null;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  } | null;
  featured: boolean;
  assemblyRequired: boolean;
  images: Array<{
    _key: string;
    asset: {
      _id: string;
      url: string;
    } | null;
  }>;
}

const PRODUCT_PROJECTION = `{
  _id,
  name,
  slug,
  description,
  price,
  stock,
  "category": category->name,
  material,
  color,
  dimensions,
  featured,
  assemblyRequired,
  images[]{
    _key,
    asset->{
      _id,
      url
    }
  }
}`;

/**
 * Fetch product data from Sanity (server-side only).
 * Checks for draft first, falls back to published.
 */
export async function getProductById(
  productId: string,
): Promise<ProductDetail | null> {
  try {
    const publishedId = productId.replace("drafts.", "");
    const draftId = `drafts.${publishedId}`;

    console.log("[getProductById] Fetching:", {
      productId,
      draftId,
      publishedId,
    });

    // Try to get draft first (for admin preview)
    let product = await client.fetch<ProductDetail>(
      `*[_id == $draftId][0]${PRODUCT_PROJECTION}`,
      { draftId },
      { cache: "no-store" }, // Disable Next.js caching
    );

    console.log("[getProductById] Draft found:", !!product);

    // If no draft, get published version
    if (!product) {
      product = await client.fetch<ProductDetail>(
        `*[_id == $publishedId][0]${PRODUCT_PROJECTION}`,
        { publishedId },
        { cache: "no-store" },
      );
      console.log("[getProductById] Published found:", !!product);
    }

    if (product) {
      console.log("[getProductById] Returning product:", product.name);
    }

    return product;
  } catch (error) {
    console.error("[Get Product Error]:", error);
    return null;
  }
}
