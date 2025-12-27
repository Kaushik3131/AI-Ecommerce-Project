"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils";

interface OrderProjection {
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

function OrderRowContent(handle: DocumentHandle) {
  const { data } = useDocumentProjection<OrderProjection>({
    ...handle,
    projection: `{
      orderNumber,
      email,
      total,
      status,
      createdAt,
      "itemCount": count(items)
    }`,
  });

  if (!data) return null;

  const status = getOrderStatus(data.status);
  const StatusIcon = status.icon;

  return (
    <TableRow className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      {/* Order Info - Mobile: includes email, items, total */}
      <TableCell className="py-3 sm:py-4">
        <Link href={`/admin/orders/${handle.documentId}`} className="block">
          <div className="flex items-center justify-between gap-2 sm:block">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              #{formatOrderNumber(data.orderNumber)}
            </span>
            {/* Mobile: Total inline */}
            <span className="font-medium text-zinc-900 dark:text-zinc-100 sm:hidden">
              {formatPrice(data.total)}
            </span>
          </div>
          {/* Mobile: Email and items */}
          <div className="mt-1 sm:hidden">
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {data.email}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              {data.itemCount} {data.itemCount === 1 ? "item" : "items"}
              {data.createdAt && (
                <>
                  {" · "}
                  {formatDate(data.createdAt, "short")}
                </>
              )}
            </p>
          </div>
        </Link>
      </TableCell>

      {/* Email - Desktop only */}
      <TableCell className="hidden py-4 text-zinc-500 dark:text-zinc-400 sm:table-cell">
        <Link
          href={`/admin/orders/${handle.documentId}`}
          className="block truncate"
        >
          {data.email}
        </Link>
      </TableCell>

      {/* Items - Desktop only */}
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Link href={`/admin/orders/${handle.documentId}`} className="block">
          {data.itemCount}
        </Link>
      </TableCell>

      {/* Total - Desktop only */}
      <TableCell className="hidden py-4 font-medium text-zinc-900 dark:text-zinc-100 sm:table-cell">
        <Link href={`/admin/orders/${handle.documentId}`} className="block">
          {formatPrice(data.total)}
        </Link>
      </TableCell>

      {/* Status - Always visible */}
      <TableCell className="py-3 sm:py-4">
        <Link
          href={`/admin/orders/${handle.documentId}`}
          className="flex justify-center sm:justify-start"
        >
          <Badge
            className={`${status.color} flex w-fit items-center gap-1 text-[10px] sm:text-xs`}
          >
            <StatusIcon className="h-3 w-3" />
            <span className="hidden sm:inline">{status.label}</span>
          </Badge>
        </Link>
      </TableCell>

      {/* Date - Desktop only */}
      <TableCell className="hidden py-4 text-zinc-500 dark:text-zinc-400 md:table-cell">
        <Link href={`/admin/orders/${handle.documentId}`} className="block">
          {formatDate(data.createdAt, "long", "—")}
        </Link>
      </TableCell>
    </TableRow>
  );
}

function OrderRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="py-3 sm:py-4">
        <div>
          <div className="flex items-center justify-between gap-2 sm:block">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14 sm:hidden" />
          </div>
          <div className="mt-1 sm:hidden">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="hidden py-4 text-center md:table-cell">
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex justify-center sm:justify-start">
          <Skeleton className="h-5 w-8 sm:w-20" />
        </div>
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}

export function OrderRow(props: DocumentHandle) {
  return (
    <Suspense fallback={<OrderRowSkeleton />}>
      <OrderRowContent {...props} />
    </Suspense>
  );
}

export { OrderRowSkeleton };
