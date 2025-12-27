import { OrderCardSkeleton } from "@/components/app/OrderCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-52" />
      </div>

      <OrderCardSkeleton count={4} />
    </div>
  );
}
