"use client";

import { Suspense, useState, useEffect } from "react";
import { useDocument, type DocumentHandle } from "@sanity/sdk-react";
import { updateAdminDocument } from "@/lib/actions/admin-actions";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StockInputProps extends DocumentHandle {}

function StockInputContent(handle: StockInputProps) {
  const { data: stock } = useDocument({ ...handle, path: "stock" });
  const [localValue, setLocalValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync local value with server value when it changes
  useEffect(() => {
    if (stock !== undefined && stock !== null) {
      setLocalValue(stock.toString());
    }
  }, [stock]);

  const handleSave = async () => {
    const newValue = parseInt(localValue) || 0;

    // Only save if different from current server value
    if (newValue === stock) return;

    setIsSaving(true);
    const result = await updateAdminDocument(
      handle.documentId,
      "stock",
      newValue,
    );
    setIsSaving(false);

    if (!result.success) {
      toast.error(`Update failed: ${result.error}`);
      // Revert local value on error
      setLocalValue(stock?.toString() || "0");
    } else {
      toast.success("Stock updated");
    }
  };

  const stockNum = parseInt(localValue) || 0;
  const isLowStock = stockNum > 0 && stockNum <= 5;
  const isOutOfStock = stockNum === 0;

  return (
    <Input
      type="number"
      min={0}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === "Enter" && handleSave()}
      className={cn(
        "h-8 w-20 text-center transition-opacity",
        isSaving && "opacity-50 cursor-wait",
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
