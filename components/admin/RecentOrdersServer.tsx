import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatOrderNumber } from "@/lib/utils";
import { getRecentOrders } from "@/lib/data/recent-orders";

export async function RecentOrdersServer() {
  const orders = await getRecentOrders(5);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Orders
        </h2>
      </div>
      <div className="p-4">
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <ShoppingCart className="h-6 w-6 text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const status = getOrderStatus(order.status);
              const StatusIcon = status.icon;

              return (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      #{formatOrderNumber(order.orderNumber)}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {order.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPrice(order.total)}
                    </p>
                    <Badge
                      className={`${status.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
