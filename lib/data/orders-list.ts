import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
}

interface GetOrdersParams {
  statusFilter?: string;
  searchQuery?: string;
  limit?: number;
}

export async function getOrders({
  statusFilter = "all",
  searchQuery,
  limit = 20,
}: GetOrdersParams = {}): Promise<Order[]> {
  const filters: string[] = [];

  // Status filter
  if (statusFilter !== "all") {
    filters.push(`status == "${statusFilter}"`);
  }

  // Search filter
  if (searchQuery && searchQuery.trim()) {
    const search = searchQuery.trim().toLowerCase();
    filters.push(
      `(orderNumber match "${search}*" || email match "${search}*")`,
    );
  }

  const filterQuery = filters.length > 0 ? ` && ${filters.join(" && ")}` : "";

  const query = `*[_type == "order"${filterQuery}] | order(_createdAt desc) [0...${limit}] {
    _id,
    orderNumber,
    email,
    total,
    status,
    createdAt
  }`;

  const orders = await client.fetch<Order[]>(query);
  return orders;
}
