import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Search */}
      <div>
        <Skeleton className="mb-2 h-4 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Category */}
      <div>
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Color */}
      <div>
        <Skeleton className="mb-2 h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Material */}
      <div>
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Price Range */}
      <div>
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="mt-4 h-2 w-full" />
      </div>

      {/* Sort */}
      <div>
        <Skeleton className="mb-2 h-4 w-14" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
