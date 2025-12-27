import { Skeleton } from "@/components/ui/skeleton";

export function SuccessPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Success Icon */}
        <Skeleton className="mx-auto h-20 w-20 rounded-full" />

        {/* Title */}
        <Skeleton className="mx-auto mt-6 h-8 w-56" />

        {/* Description */}
        <Skeleton className="mx-auto mt-2 h-5 w-80" />

        {/* Order Details Card */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-950">
          <Skeleton className="h-5 w-32" />
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-40" />
        </div>
      </div>
    </div>
  );
}
