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
  "category": category->title,
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
/**
 * Fetch a list of products from Sanity (server-side only).
 * Supports search filtering and pagination.
 */
export async function getProducts(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductDetail[]> {
  try {
    const limit = options?.limit || 20; // Default 20 items per page
    const offset = options?.offset || 0;

    let query = `*[_type == "product"`;

    // Add search filter if provided
    if (options?.search) {
      query += ` && (name match $search || description match $search)`;
    }

    query += `] | order(stock asc, name asc)[${offset}...${offset + limit}]${PRODUCT_PROJECTION}`;

    const products = await client.fetch<ProductDetail[]>(
      query,
      options?.search ? { search: `*${options.search}*` } : {},
      { cache: "no-store" },
    );

    return products;
  } catch (error) {
    console.error("[Get Products Error]:", error);
    return [];
  }
}

export async function getProductById(
  productId: string,
): Promise<ProductDetail | null> {
  try {
    const publishedId = productId.replace("drafts.", "");
    const draftId = `drafts.${publishedId}`;

    let product = await client.fetch<ProductDetail>(
      `*[_id == $draftId][0]${PRODUCT_PROJECTION}`,
      { draftId },
      { cache: "no-store" },
    );

    if (!product) {
      product = await client.fetch<ProductDetail>(
        `*[_id == $publishedId][0]${PRODUCT_PROJECTION}`,
        { publishedId },
        { cache: "no-store" },
      );
    }

    return product;
  } catch (error) {
    console.error("[Get Product Error]:", error);
    return null;
  }
}
