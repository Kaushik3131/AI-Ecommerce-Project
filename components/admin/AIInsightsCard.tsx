"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Lightbulb,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SalesTrends {
  summary: string;
  highlights: string[];
  trend: "up" | "down" | "stable";
}

interface Inventory {
  summary: string;
  alerts: string[];
  recommendations: string[];
}

interface ActionItems {
  urgent: string[];
  recommended: string[];
  opportunities: string[];
}

interface Insights {
  salesTrends: SalesTrends;
  inventory: Inventory;
  actionItems: ActionItems;
}

interface RawMetrics {
  currentRevenue: number;
  previousRevenue: number;
  revenueChange: string;
  orderCount: number;
  avgOrderValue: string;
  unfulfilledCount: number;
  lowStockCount: number;
}

interface InsightsResponse {
  success: boolean;
  insights: Insights;
  rawMetrics: RawMetrics;
  generatedAt: string;
  error?: string;
}

function AIInsightsCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-zinc-400" />;
}

export function AIInsightsCard() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetched = useRef(false);

  const fetchInsights = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch("/api/admin/insights");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch insights");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Prevent double fetch in React StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return <AIInsightsCardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Failed to load insights
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInsights()}
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.insights) {
    return null;
  }

  const { insights, rawMetrics, generatedAt } = data;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              AI Insights
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Updated{" "}
              {new Date(generatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchInsights(true)}
          disabled={refreshing}
          className="gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 gap-px border-b border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-4">
        <div className="bg-white p-4 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Revenue (7d)
          </p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            £
            {Number(rawMetrics.currentRevenue).toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p
            className={cn(
              "text-xs",
              Number(rawMetrics.revenueChange) > 0
                ? "text-emerald-600"
                : Number(rawMetrics.revenueChange) < 0
                  ? "text-red-600"
                  : "text-zinc-500",
            )}
          >
            {Number(rawMetrics.revenueChange) > 0 ? "+" : ""}
            {rawMetrics.revenueChange}% vs last week
          </p>
        </div>
        <div className="bg-white p-4 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Orders (7d)
          </p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {rawMetrics.orderCount}
          </p>
          <p className="text-xs text-zinc-500">This week</p>
        </div>
        <div className="bg-white p-4 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Avg Order
          </p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            £{rawMetrics.avgOrderValue}
          </p>
          <p className="text-xs text-zinc-500">Per order</p>
        </div>
        <div className="bg-white p-4 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Pending
          </p>
          <p
            className={cn(
              "mt-1 text-lg font-bold",
              rawMetrics.unfulfilledCount > 0
                ? "text-amber-600"
                : "text-emerald-600",
            )}
          >
            {rawMetrics.unfulfilledCount}
          </p>
          <p className="text-xs text-zinc-500">To ship</p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-6 p-6 md:grid-cols-3">
        {/* Sales Trends */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendIcon trend={insights.salesTrends.trend} />
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Sales Trends
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {insights.salesTrends.summary}
          </p>
          <ul className="space-y-2">
            {insights.salesTrends.highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Inventory
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {insights.inventory.summary}
          </p>
          {insights.inventory.alerts.length > 0 && (
            <div className="space-y-2">
              {insights.inventory.alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}
          <ul className="space-y-2">
            {insights.inventory.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-500" />
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Action Items
            </h3>
          </div>

          {insights.actionItems.urgent.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
                Urgent
              </p>
              {insights.actionItems.urgent.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {insights.actionItems.recommended.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Recommended
              </p>
              <ul className="space-y-1">
                {insights.actionItems.recommended.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.actionItems.opportunities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Opportunities
              </p>
              <ul className="space-y-1">
                {insights.actionItems.opportunities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
