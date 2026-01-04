"use client";

import { useState, useTransition } from "react";
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

interface StatusSelectProps {
  documentId: string;
  currentStatus: string;
}

export function StatusSelect({ documentId, currentStatus }: StatusSelectProps) {
  // Optimistic UI: Track the "display" status separately
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const displayStatus = optimisticStatus || currentStatus;
  const statusConfig = getOrderStatus(displayStatus);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = (value: string) => {
    // OPTIMISTIC: Update UI immediately
    setOptimisticStatus(value);

    // Start the server mutation in the background
    startTransition(async () => {
      const result = await updateDraftField(documentId, "status", value);

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
    <Select
      value={displayStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            {statusConfig.label}
            {isPending && (
              <span className="text-xs text-zinc-400">(Saving...)</span>
            )}
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
  );
}
