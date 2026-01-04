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
  const [optimisticStock, setOptimisticStock] = useState(currentStock);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOptimisticStock(currentStock);
  }, [currentStock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;

    setOptimisticStock(value);
    setIsSaving(true);

    updateDraftField(documentId, "stock", value).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success("Stock updated in draft");
      } else {
        setOptimisticStock(currentStock);
        toast.error(`Update failed: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="0"
        value={optimisticStock}
        onChange={handleChange}
        placeholder="0"
      />
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
    </div>
  );
}
