import { Skeleton } from "@/components/ui/skeleton";

export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <Skeleton className="aspect-square w-full rounded-lg" />
      
      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-md" />
        ))}
      </div>
    </div>
  );
}
