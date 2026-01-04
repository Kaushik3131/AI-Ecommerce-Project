"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FeaturedEditorProps {
  documentId: string;
  currentFeatured: boolean;
}

export function FeaturedEditor({
  documentId,
  currentFeatured,
}: FeaturedEditorProps) {
  const [optimisticFeatured, setOptimisticFeatured] = useState(currentFeatured);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOptimisticFeatured(currentFeatured);
  }, [currentFeatured]);

  const handleChange = (checked: boolean) => {
    setOptimisticFeatured(checked);
    setIsSaving(true);

    updateDraftField(documentId, "featured", checked).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success(
          `Product ${checked ? "featured" : "unfeatured"} in draft`,
        );
      } else {
        setOptimisticFeatured(currentFeatured);
        toast.error(`Update failed: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={optimisticFeatured} onCheckedChange={handleChange} />
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
    </div>
  );
}
