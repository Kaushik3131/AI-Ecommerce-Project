"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useDocuments,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ProductProjection {
  name: string;
  stock: number;
  image: {
    asset: {
      url: string;
    } | null;
  } | null;
}

function LowStockProductRow(handle: DocumentHandle) {
  const { data } = useDocumentProjection<ProductProjection>({
    ...handle,
    projection: `{
      name,
      stock,
      "image": images[0]{
        asset->{
          url
        }
      }
    }`,
  });

  if (!data) return null;

  const isOutOfStock = data.stock === 0;

  return (
    <Link
      href={`/admin/inventory/${handle.documentId}`}
      className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-700">
        {data.image?.asset?.url ? (
          <Image
            src={data.image.asset.url}
            alt={data.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {data.name}
        </p>
      </div>
      <Badge
        variant={isOutOfStock ? "destructive" : "secondary"}
        className="shrink-0"
      >
        {isOutOfStock ? "Out of stock" : `${data.stock} left`}
      </Badge>
    </Link>
  );
}

function LowStockProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

function LowStockAlertContent() {
  // Fetch products with low stock (stock <= 5)
  const { data: lowStockProducts } = useDocuments({
    documentType: "product",
    filter: "stock <= 5",
    orderings: [{ field: "stock", direction: "asc" }],
    batchSize: 10,
  });

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All products are well stocked!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {lowStockProducts.slice(0, 5).map((handle) => (
        <Suspense
          key={handle.documentId}
          fallback={<LowStockProductRowSkeleton />}
        >
          <LowStockProductRow {...handle} />
        </Suspense>
      ))}
      {lowStockProducts.length > 5 && (
        <Link
          href="/admin/inventory?filter=low-stock"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          View all {lowStockProducts.length} low stock items →
        </Link>
      )}
    </div>
  );
}

function LowStockAlertSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <LowStockProductRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function LowStockAlert() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Low Stock Alerts
        </h2>
      </div>
      <div className="p-4">
        <Suspense fallback={<LowStockAlertSkeleton />}>
          <LowStockAlertContent />
        </Suspense>
      </div>
    </div>
  );
}
