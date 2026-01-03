"use client";

import { Suspense, useState, useEffect } from "react";
import { useDocument, type DocumentHandle } from "@sanity/sdk-react";
import { updateAdminDocument } from "@/lib/actions/admin-actions";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PriceInputProps extends DocumentHandle {}

function PriceInputContent(handle: PriceInputProps) {
  const { data: price } = useDocument({ ...handle, path: "price" });
  const [localValue, setLocalValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (price !== undefined && price !== null) {
      setLocalValue(price.toString());
    }
  }, [price]);

  const handleSave = async () => {
    const newValue = parseFloat(localValue) || 0;
    if (newValue === price) return;

    setIsSaving(true);
    const result = await updateAdminDocument(
      handle.documentId,
      "price",
      newValue,
    );
    setIsSaving(false);

    if (!result.success) {
      toast.error(`Update failed: ${result.error}`);
      setLocalValue(price?.toString() || "0");
    } else {
      toast.success("Price updated");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-zinc-500">₹</span>
      <Input
        type="number"
        min={0}
        step={0.01}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className={cn(
          "h-8 w-24 text-right transition-opacity",
          isSaving && "opacity-50 cursor-wait",
        )}
      />
    </div>
  );
}

function PriceInputSkeleton() {
  return <Skeleton className="h-8 w-24" />;
}

export function PriceInput(props: PriceInputProps) {
  return (
    <Suspense fallback={<PriceInputSkeleton />}>
      <PriceInputContent {...props} />
    </Suspense>
  );
}
