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
  const [value, setValue] = useState(currentPrice.toString());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(currentPrice.toString());
  }, [currentPrice]);

  const handleBlur = () => {
    const numValue = parseFloat(value);
    if (Number.isNaN(numValue) || numValue === currentPrice) return;

    setIsSaving(true);

    updateDraftField(documentId, "price", numValue).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success("Price updated in draft");
      } else {
        setValue(currentPrice.toString());
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="0.00"
      />
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
    </div>
  );
}
