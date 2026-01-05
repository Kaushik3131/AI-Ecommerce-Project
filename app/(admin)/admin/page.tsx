import {
  StatCardServer,
  LowStockAlertServer,
  RecentOrdersServer,
  AIInsightsCard,
  CreateProductButton,
  AutoRefresh,
  DashboardRefreshButton,
} from "@/components/admin";

export default function AdminDashboard() {
  return (
    <AutoRefresh intervalMs={30000}>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
              Overview of your store
            </p>
          </div>
          <div className="flex gap-2">
            <DashboardRefreshButton />
            <CreateProductButton />
          </div>
        </div>

        {/* AI Insights */}
        <AIInsightsCard />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCardServer
            title="Total Products"
            icon="package"
            documentType="product"
            href="/admin/inventory"
          />
          <StatCardServer
            title="Total Orders"
            icon="shopping-cart"
            documentType="order"
            href="/admin/orders"
          />
          <StatCardServer
            title="Low Stock Items"
            icon="trending-up"
            documentType="product"
            filter="stock <= 5"
            href="/admin/inventory"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <LowStockAlertServer />
          <RecentOrdersServer />
        </div>
      </div>
    </AutoRefresh>
  );
}
