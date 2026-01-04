"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StockEditorProps {
  documentId: string;
  currentStock: number;
}

export function StockEditor({ documentId, currentStock }: StockEditorProps) {
  const [value, setValue] = useState(currentStock.toString());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(currentStock.toString());
  }, [currentStock]);

  const handleBlur = () => {
    const numValue = parseInt(value);
    if (Number.isNaN(numValue) || numValue === currentStock) return;

    setIsSaving(true);

    updateDraftField(documentId, "stock", numValue).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success("Stock updated in draft");
      } else {
        setValue(currentStock.toString());
        toast.error(`Update failed: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="0"
      />
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
    </div>
  );
}
