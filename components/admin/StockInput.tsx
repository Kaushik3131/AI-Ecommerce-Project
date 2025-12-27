"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StockInputProps extends DocumentHandle {}

function StockInputContent(handle: StockInputProps) {
  const { data: stock } = useDocument({ ...handle, path: "stock" });
  const editStock = useEditDocument({ ...handle, path: "stock" });

  const stockValue = (stock as number) ?? 0;
  const isLowStock = stockValue > 0 && stockValue <= 5;
  const isOutOfStock = stockValue === 0;

  return (
    <Input
      type="number"
      min={0}
      value={stockValue}
      onChange={(e) => editStock(parseInt(e.target.value) || 0)}
      className={cn(
        "h-8 w-20 text-center",
        isOutOfStock &&
          "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        isLowStock &&
          "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
      )}
    />
  );
}

function StockInputSkeleton() {
  return <Skeleton className="h-8 w-20" />;
}

export function StockInput(props: StockInputProps) {
  return (
    <Suspense fallback={<StockInputSkeleton />}>
      <StockInputContent {...props} />
    </Suspense>
  );
}
