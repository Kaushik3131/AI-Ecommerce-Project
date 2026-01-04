"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORDER_STATUS_CONFIG,
  getOrderStatus,
} from "@/lib/constants/orderStatus";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StatusSelectProps {
  documentId: string;
  currentStatus: string;
}

export function StatusSelect({ documentId, currentStatus }: StatusSelectProps) {
  // Optimistic UI: Track the "display" status separately
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  // Reset optimistic state when currentStatus changes (e.g., after discard/publish)
  useEffect(() => {
    setOptimisticStatus(currentStatus);
  }, [currentStatus]);

  const displayStatus = optimisticStatus || currentStatus;
  const statusConfig = getOrderStatus(displayStatus);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = (value: string) => {
    // INSTANT: Update UI immediately (no waiting!)
    setOptimisticStatus(value);
    setIsSaving(true);

    // Fire and forget: Save to draft in background (completely async)
    updateDraftField(documentId, "status", value).then((result) => {
      setIsSaving(false);

      if (result.success) {
        toast.success(
          "Status updated in draft. Click 'Publish Changes' to make it live.",
        );
      } else {
        // REVERT: If it failed, go back to the original status
        setOptimisticStatus(currentStatus);
        toast.error(`Update failed: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={displayStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              {statusConfig.label}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ORDER_STATUS_CONFIG).map(([value, config]) => {
            const Icon = config.icon;
            return (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {config.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {isSaving && (
        <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
}
