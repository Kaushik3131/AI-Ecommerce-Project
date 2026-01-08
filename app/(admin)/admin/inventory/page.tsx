import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody } from "@/components/ui/table";
import { getProducts } from "@/lib/data/products";
import { CreateProductButton } from "@/components/admin/CreateProductButton";
import { InventorySearch } from "@/components/admin/InventorySearch";
import { ProductRowServer } from "@/components/admin/ProductRowServer";
import { ProductTableHeader } from "@/components/admin";
import { LoadMoreButton } from "@/components/admin/LoadMoreButton";
import { DashboardRefreshButton } from "@/components/admin/DashboardRefreshButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 20;

export default async function InventoryPage({ searchParams }: PageProps) {
  const { search, page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);

  // Fetch ALL items up to current page (to simulate infinite scroll)
  const totalToFetch = page * ITEMS_PER_PAGE;

  const products = await getProducts({
    search,
    limit: totalToFetch + 1,
    offset: 0,
  });

  const hasMore = products && products.length > totalToFetch;
  const displayProducts = hasMore ? products.slice(0, totalToFetch) : products;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            Manage your product stock and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <DashboardRefreshButton />
          <CreateProductButton />
        </div>
      </div>

      {/* Search */}
      <InventorySearch />

      {/* Product List */}
      {!products || products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? "No products found" : "No products yet"}
          description={
            search
              ? "Try adjusting your search terms."
              : "Get started by adding your first product."
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Table>
              <ProductTableHeader />
              <TableBody>
                {displayProducts.map((product) => (
                  <ProductRowServer key={product._id} product={product} />
                ))}
              </TableBody>
            </Table>
          </div>

          {hasMore && <LoadMoreButton currentPage={page} search={search} />}
        </>
      )}
    </div>
  );
}
