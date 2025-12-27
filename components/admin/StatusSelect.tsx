"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  useApplyDocumentActions,
  publishDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_CONFIG, getOrderStatus, type OrderStatusValue } from "@/lib/constants/orderStatus";

interface StatusSelectProps extends DocumentHandle {}

function StatusSelectContent(handle: StatusSelectProps) {
  const { data: status } = useDocument({ ...handle, path: "status" });
  const editStatus = useEditDocument({ ...handle, path: "status" });
  const apply = useApplyDocumentActions();

  const currentStatus = (status as string) ?? "paid";
  const statusConfig = getOrderStatus(currentStatus);
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (value: string) => {
    editStatus(value);
    // Auto-publish status changes so they take effect immediately
    await apply(publishDocument(handle));
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
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
