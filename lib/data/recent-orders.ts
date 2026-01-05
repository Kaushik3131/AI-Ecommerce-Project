import { client } from "@/sanity/lib/client";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
}

export async function getRecentOrders(
  limit: number = 5,
): Promise<RecentOrder[]> {
  const query = `*[_type == "order"] | order(_createdAt desc) [0...${limit}] {
    _id,
    orderNumber,
    email,
    total,
    status,
    createdAt
  }`;

  const orders = await client.fetch<RecentOrder[]>(query);
  return orders;
}
