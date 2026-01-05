"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleAlert, Star, ExternalLink } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isLowStock, isOutOfStock } from "@/lib/constants/stock";
import { formatPrice } from "@/lib/utils";
import type { ProductDetail } from "@/lib/data/products";

interface ProductRowServerProps {
  product: ProductDetail;
}

export function ProductRowServer({ product }: ProductRowServerProps) {
  const lowStock = isLowStock(product.stock);
  const outOfStock = isOutOfStock(product.stock);

  return (
    <TableRow className="group">
      {/* Image - Desktop only */}
      <TableCell className="hidden py-3 sm:table-cell">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {product.images?.[0]?.asset?.url ? (
            <Image
              src={product.images[0].asset.url}
              alt={product.name}
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

      {/* Name - Mobile: includes image, price, stock */}
      <TableCell className="py-3 sm:py-4">
        <Link
          href={`/admin/inventory/${product._id}`}
          className="flex items-start gap-3 sm:block"
        >
          {/* Mobile image */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 sm:hidden">
            {product.images?.[0]?.asset?.url ? (
              <Image
                src={product.images[0].asset.url}
                alt={product.name}
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
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                {product.name}
              </span>
              {product.featured && (
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {product.category || product.slug?.current}
            </div>

            {/* Mobile-only info */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs sm:hidden">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatPrice(product.price)}
              </span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {product.stock} in stock
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
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {formatPrice(product.price)}
        </span>
      </TableCell>

      {/* Stock - Desktop only */}
      <TableCell className="hidden py-4 md:table-cell">
        <div className="flex items-center gap-2">
          <span className="text-zinc-900 dark:text-zinc-100">
            {product.stock}
          </span>
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
        {product.featured && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Yes</span>
        )}
      </TableCell>

      {/* Actions - Desktop only */}
      <TableCell className="hidden py-4 sm:table-cell">
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/inventory/${product._id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
