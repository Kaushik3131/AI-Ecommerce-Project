import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDocumentCount } from "@/lib/data/stats";

const iconMap: Record<string, LucideIcon> = {
  package: Package,
  "shopping-cart": ShoppingCart,
  "trending-up": TrendingUp,
};

interface StatCardServerProps {
  title: string;
  icon: string;
  documentType: string;
  filter?: string;
  valueFormatter?: (count: number) => string;
  href?: string;
}

export async function StatCardServer({
  title,
  icon: iconName,
  documentType,
  filter,
  valueFormatter = (count) => count.toString(),
  href,
}: StatCardServerProps) {
  const count = await getDocumentCount(documentType, filter);
  const Icon = iconMap[iconName] || Package;

  const content = (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900",
        href &&
          "cursor-pointer transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {valueFormatter(count)}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
