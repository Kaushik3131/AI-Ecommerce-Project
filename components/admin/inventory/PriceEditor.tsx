"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PriceEditorProps {
  documentId: string;
  currentPrice: number;
}

export function PriceEditor({ documentId, currentPrice }: PriceEditorProps) {
  const [optimisticPrice, setOptimisticPrice] = useState(currentPrice);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOptimisticPrice(currentPrice);
  }, [currentPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;

    setOptimisticPrice(value);
    setIsSaving(true);

    updateDraftField(documentId, "price", value).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success("Price updated in draft");
      } else {
        setOptimisticPrice(currentPrice);
        toast.error(`Update failed: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        step="0.01"
        min="0"
        value={optimisticPrice}
        onChange={handleChange}
        placeholder="0.00"
      />
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
    </div>
  );
}
