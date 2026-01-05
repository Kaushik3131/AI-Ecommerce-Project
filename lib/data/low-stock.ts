import { client } from "@/sanity/lib/client";

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  image: {
    asset: {
      url: string;
    } | null;
  } | null;
}

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const query = `*[_type == "product" && stock <= 5] | order(stock asc) [0...10] {
    _id,
    name,
    stock,
    "image": images[0]{
      asset->{
        url
      }
    }
  }`;

  const products = await client.fetch<LowStockProduct[]>(query);
  return products;
}
