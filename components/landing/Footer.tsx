import Link from "next/link";
import {
  Armchair,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-(--festive-primary) to-red-700 shadow-md">
                <Armchair className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                  FurnitureCo
                </span>
                <span className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-(--festive-primary)">
                  Festive Edition
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Handcrafted luxury furniture to transform your home. Quality,
              style, and comfort in every piece.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4 shrink-0 text-(--festive-primary)" />
                <span>123 Furniture Street, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-(--festive-primary)" />
                <a
                  href="tel:+911234567890"
                  className="hover:text-(--festive-primary)"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4 shrink-0 text-(--festive-primary)" />
                <a
                  href="mailto:info@furnitureco.com"
                  className="hover:text-(--festive-primary)"
                >
                  info@furnitureco.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} FurnitureCo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                type="button"
                className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="text-sm text-zinc-600 transition-colors hover:text-(--festive-primary) dark:text-zinc-400"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
