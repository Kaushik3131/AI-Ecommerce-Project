"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import type {
  ALL_CATEGORIES_QUERYResult,
  FILTER_PRODUCTS_BY_NAME_QUERYResult,
} from "@/sanity.types";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
  searchQuery: string;
}

export function ProductSection({
  categories,
  products,
  searchQuery,
}: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with results count and filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {displayedProducts.length} of {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
          {searchQuery && (
            <span>
              {" "}
              for &quot;<span className="font-medium">{searchQuery}</span>&quot;
            </span>
          )}
        </p>

        {/* Filter toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          aria-label={filtersOpen ? "Hide filters" : "Show filters"}
        >
          {filtersOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="hidden sm:inline">Hide Filters</span>
              <span className="sm:hidden">Hide</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Show Filters</span>
              <span className="sm:hidden">Filters</span>
            </>
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters - completely hidden when collapsed on desktop */}
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            filtersOpen ? "w-full lg:w-72 lg:opacity-100" : "hidden lg:hidden"
          }`}
        >
          <ProductFilters categories={categories} />
        </aside>

        {/* Product Grid - expands to full width when filters hidden */}
        <main className="flex-1 transition-all duration-300">
          <ProductGrid products={displayedProducts} />

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={loadMore}
                size="lg"
                className="gap-2 bg-linear-to-r from-(--festive-primary) to-red-700 px-8 py-6 text-base font-bold shadow-lg shadow-(--festive-primary)/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-(--festive-primary)/30"
              >
                Load More Products
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                  {products.length - displayCount} remaining
                </span>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
