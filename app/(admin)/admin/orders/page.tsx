import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderTableHeader } from "@/components/admin";
import { Badge } from "@/components/ui/badge";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatOrderNumber } from "@/lib/utils";
import { getOrders } from "@/lib/data/orders-list";
import { OrdersFilters } from "@/components/admin/OrdersFilters";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const searchQuery = params.search || "";

  const orders = await getOrders({
    statusFilter,
    searchQuery,
    limit: 50,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Orders
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
          Manage and track customer orders
        </p>
      </div>

      {/* Search and Tabs */}
      <OrdersFilters />

      {/* Order List */}
      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description={
            searchQuery
              ? "Try adjusting your search terms."
              : statusFilter === "all"
                ? "Orders will appear here when customers make purchases."
                : `No ${statusFilter} orders at the moment.`
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <Table>
            <OrderTableHeader />
            <TableBody>
              {orders.map((order) => {
                const status = getOrderStatus(order.status);
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={order._id}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                      >
                        #{formatOrderNumber(order.orderNumber)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {order.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${status.color} flex w-fit items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
