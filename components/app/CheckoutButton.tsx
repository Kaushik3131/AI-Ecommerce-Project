"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartItems } from "@/lib/store/cart-store-provider";
import { createCheckoutSession } from "@/lib/actions/checkout";

interface CheckoutButtonProps {
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const router = useRouter();
  const items = useCartItems();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    setError(null);

    // Check if address is already saved
    const savedAddress = sessionStorage.getItem("checkoutAddress");

    if (!savedAddress) {
      // Redirect to address page first
      router.push("/checkout/address");
      return;
    }

    // Address exists, proceed with payment
    startTransition(async () => {
      // Parse address from sessionStorage
      const address = JSON.parse(savedAddress);

      const result = await createCheckoutSession(items, address);

      if (result.success && result.url) {
        // Redirect to PhonePe Checkout
        router.push(result.url);
      } else {
        setError(result.error ?? "Checkout failed");
        toast.error("Checkout Error", {
          description: result.error ?? "Something went wrong",
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={disabled || isPending || items.length === 0}
        size="lg"
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Checkout
          </>
        )}
      </Button>
      {error && (
        <p className="text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
