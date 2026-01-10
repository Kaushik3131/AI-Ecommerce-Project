import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | The Furniture Store",
  description:
    "Learn more about our story and commitment to quality furniture.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-zinc-900 dark:text-white">
          About Us
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          Coming soon...
        </p>

        <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            This page is under construction. Check back soon for our story,
            values, and commitment to quality craftsmanship.
          </p>

          <Button asChild>
            <Link href="/shop" className="gap-2">
              Browse Our Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
