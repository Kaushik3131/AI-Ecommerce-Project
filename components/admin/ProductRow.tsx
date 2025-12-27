"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useDocument,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { CircleAlert, ExternalLink, Star } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { isLowStock, isOutOfStock } from "@/lib/constants/stock";
import { StockInput } from "./StockInput";
import { PriceInput } from "./PriceInput";
import { FeaturedToggle } from "./FeaturedToggle";
import { PublishButton, RevertButton } from "./PublishButton";

interface ProductProjection {
  name: string;
  slug: string;
  stock: number;
  price: number;
  featured: boolean;
  category: {
    title: string;
  } | null;
  image: {
    asset: {
      url: string;
    } | null;
  } | null;
}

function ProductRowContent(handle: DocumentHandle) {
  const { data } = useDocumentProjection<ProductProjection>({
    ...handle,
    projection: `{
      name,
      "slug": slug.current,
      stock,
      price,
      featured,
      category->{
        title
      },
      "image": images[0]{
        asset->{
          url
        }
      }
    }`,
  });

  // Check if document is a draft (unpublished changes)
  const { data: document } = useDocument(handle);
  const isDraft = document?._id?.startsWith("drafts.");

  if (!data) return null;

  const lowStock = isLowStock(data.stock);
  const outOfStock = isOutOfStock(data.stock);

  return (
    <TableRow className="group">
      {/* Image - Desktop only */}
      <TableCell className="hidden py-3 sm:table-cell">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {data.image?.asset?.url ? (
            <Image
              src={data.image.asset.url}
              alt={data.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              ?
            </div>
          )}
        </div>
      </TableCell>

      {/* Name - Mobile: includes image, price, stock badges */}
      <TableCell className="py-3 sm:py-4">
        <Link
          href={`/admin/inventory/${handle.documentId}`}
          className="flex items-start gap-3 sm:block"
        >
          {/* Mobile image */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 sm:hidden">
            {data.image?.asset?.url ? (
              <Image
                src={data.image.asset.url}
                alt={data.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                ?
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 sm:hover:text-zinc-600 sm:dark:hover:text-zinc-300">
                {data.name || "Untitled Product"}
              </span>
              {data.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400 sm:hidden" />
              )}
              {data.slug && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/products/${data.slug}`, "_blank");
                  }}
                  className="hidden shrink-0 opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                  aria-label="View product on store"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
                </button>
              )}
            </div>
            {isDraft && (
              <div className="mt-1 flex items-center gap-1 sm:hidden">
                <Badge
                  variant="outline"
                  className="h-5 gap-1 border-orange-300 bg-orange-50 px-1.5 text-[10px] font-medium text-orange-600 dark:border-orange-500/50 dark:bg-orange-950/50 dark:text-orange-400"
                >
                  <CircleAlert className="h-3 w-3" />
                  Draft
                </Badge>
              </div>
            )}
            {data.category && (
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {data.category.title}
              </p>
            )}
            {/* Mobile: show price and stock inline */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs sm:hidden">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatPrice(data.price)}
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {data.stock} in stock
              </span>
              {outOfStock && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  Out
                </Badge>
              )}
              {lowStock && (
                <Badge
                  variant="secondary"
                  className="h-5 bg-amber-100 px-1.5 text-[10px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  Low
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </TableCell>

      {/* Price - Desktop only */}
      <TableCell className="hidden py-4 md:table-cell">
        <Suspense fallback={<Skeleton className="h-8 w-24" />}>
          <PriceInput {...handle} />
        </Suspense>
      </TableCell>

      {/* Stock - Desktop only */}
      <TableCell className="hidden py-4 md:table-cell">
        <div className="flex items-center gap-2">
          <Suspense fallback={<Skeleton className="h-8 w-20" />}>
            <StockInput {...handle} />
          </Suspense>
          {outOfStock && (
            <Badge variant="destructive" className="text-xs">
              Out
            </Badge>
          )}
          {lowStock && (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            >
              Low
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Featured - Desktop only */}
      <TableCell className="hidden py-4 lg:table-cell">
        <Suspense fallback={<Skeleton className="h-8 w-8" />}>
          <FeaturedToggle {...handle} />
        </Suspense>
      </TableCell>

      {/* Actions - Desktop only */}
      <TableCell className="hidden py-4 sm:table-cell">
        <div className="flex items-center justify-end gap-2">
          <Suspense fallback={null}>
            <RevertButton {...handle} size="sm" />
          </Suspense>
          <Suspense fallback={null}>
            <PublishButton {...handle} size="sm" variant="outline" />
          </Suspense>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ProductRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="hidden py-3 sm:table-cell">
        <Skeleton className="h-12 w-12 rounded-md" />
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-md sm:hidden" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-1 h-3 w-20" />
            <div className="mt-1.5 flex gap-2 sm:hidden">
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-8 w-24" />
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-8 w-20" />
      </TableCell>
      <TableCell className="hidden py-4 lg:table-cell">
        <Skeleton className="h-8 w-8" />
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-8 w-[100px]" />
      </TableCell>
    </TableRow>
  );
}

export function ProductRow(props: DocumentHandle) {
  return (
    <Suspense fallback={<ProductRowSkeleton />}>
      <ProductRowContent {...props} />
    </Suspense>
  );
}

export { ProductRowSkeleton };
