"use client";

import { Suspense, useState } from "react";
import { useDocument, type DocumentHandle } from "@sanity/sdk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ORDER_STATUS_CONFIG,
  getOrderStatus,
} from "@/lib/constants/orderStatus";
import { updateDraftField } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";

interface StatusSelectProps extends DocumentHandle {}

function StatusSelectContent(handle: StatusSelectProps) {
  const { data: status } = useDocument({ ...handle, path: "status" });
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatus = (status as string) ?? "paid";
  const statusConfig = getOrderStatus(currentStatus);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (value: string) => {
    setIsUpdating(true);

    // Update the draft (not published)
    const result = await updateDraftField(handle.documentId, "status", value);

    setIsUpdating(false);

    if (result.success) {
      toast.success(
        "Status updated in draft. Click 'Publish Changes' to make it live.",
      );
    } else {
      toast.error(`Update failed: ${result.error}`);
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
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
  );
}

function StatusSelectSkeleton() {
  return <Skeleton className="h-10 w-[180px]" />;
}

export function StatusSelect(props: StatusSelectProps) {
  return (
    <Suspense fallback={<StatusSelectSkeleton />}>
      <StatusSelectContent {...props} />
    </Suspense>
  );
}
