import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | The Furniture Store",
  description:
    "Get in touch with us for inquiries, support, or design consultations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-zinc-900 dark:text-white">
          Contact Us
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          Coming soon...
        </p>

        <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            This page is under construction. Check back soon for our contact
            form and information.
          </p>

          <div className="mb-8 grid gap-4 text-left sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <Mail className="h-5 w-5 text-[var(--festive-primary)]" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Email
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  hello@furniture.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <Phone className="h-5 w-5 text-[var(--festive-primary)]" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Phone
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  1800-123-4567
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <MapPin className="h-5 w-5 text-[var(--festive-primary)]" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Location
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Gurugram, India
                </p>
              </div>
            </div>
          </div>

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
