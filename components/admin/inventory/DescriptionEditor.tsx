"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DescriptionEditorProps {
  documentId: string;
  currentDescription: string | null;
}

export function DescriptionEditor({
  documentId,
  currentDescription,
}: DescriptionEditorProps) {
  const [value, setValue] = useState(currentDescription || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(currentDescription || "");
  }, [currentDescription]);

  const handleBlur = () => {
    if (value === currentDescription) return;

    setIsSaving(true);

    updateDraftField(documentId, "description", value || null).then(
      (result) => {
        setIsSaving(false);

        if (result.success) {
          toast.success("Description updated in draft");
        } else {
          setValue(currentDescription || "");
          toast.error(`Update failed: ${result.error}`);
        }
      },
    );
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Product description"
        rows={4}
        className="resize-none"
      />
      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </div>
      )}
    </div>
  );
}
