"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  Loader2,
  MapPin,
  Edit,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/app/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";

interface SavedAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
}

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);
  const [showError, setShowError] = useState(false);

  // Check for payment error from URL
  const paymentError = searchParams.get("error");
  const failedOrderId = searchParams.get("orderId");

  // Load saved address from sessionStorage
  useEffect(() => {
    const addressData = sessionStorage.getItem("checkoutAddress");
    if (addressData) {
      setSavedAddress(JSON.parse(addressData));
    }

    // Show error if payment failed
    if (paymentError === "payment_failed") {
      setShowError(true);
    }
  }, [paymentError]);

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-900">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)]"
          style={{ zIndex: 0 }}
        />
        <div
          className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8"
          style={{ zIndex: 1 }}
        >
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
            <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Your cart is empty
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Add some items to your cart before checking out.
            </p>
            <Button asChild className="mt-8">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)]"
        style={{ zIndex: 0 }}
      />
      <div
        className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Checkout
          </h1>
        </div>

        {/* Payment Error Alert */}
        {showError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  {paymentError === "payment_cancelled"
                    ? "Payment Cancelled"
                    : "Payment Failed"}
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {paymentError === "payment_cancelled"
                    ? "You cancelled the payment. Your order has been cancelled and no charges were made."
                    : "Your payment could not be completed. Please try again or contact support if the issue persists."}
                </p>
                {failedOrderId && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Order ID: {failedOrderId}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowError(false)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                aria-label="Dismiss"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Order Summary ({totalItems} items)
                </h2>
              </div>

              {/* Stock Issues Warning */}
              {hasStockIssues && !isLoading && (
                <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>
                    Some items have stock issues. Please update your cart before
                    proceeding.
                  </span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Verifying stock...
                  </span>
                </div>
              )}

              {/* Cart Items List */}
              {!isLoading && (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {items.map((item) => {
                    const stockInfo = stockMap.get(item.productId);
                    const hasIssue =
                      stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                    return (
                      <div
                        key={item.productId}
                        className={`p-6 ${
                          hasIssue ? "bg-red-50 dark:bg-red-950/20" : ""
                        }`}
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                                {item.name}
                              </h3>
                              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            {stockInfo?.isOutOfStock && (
                              <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                                Out of stock
                              </p>
                            )}
                            {stockInfo?.exceedsStock &&
                              !stockInfo.isOutOfStock && (
                                <p className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                                  Only {stockInfo.currentStock} available
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order Total & Checkout */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Shipping Address */}
              {savedAddress && (
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-zinc-400" />
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Shipping Address
                      </h3>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <Link href="/checkout/address">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {savedAddress.name}
                    </p>
                    <p className="mt-1">{savedAddress.line1}</p>
                    {savedAddress.line2 && <p>{savedAddress.line2}</p>}
                    <p>
                      {savedAddress.city}, {savedAddress.postcode}
                    </p>
                    <p>{savedAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Payment Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Subtotal
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Shipping
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-zinc-900 dark:text-zinc-100">
                        Total
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <CheckoutButton disabled={hasStockIssues || isLoading} />
                </div>

                <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  You'll be redirected to PhonePe's secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
