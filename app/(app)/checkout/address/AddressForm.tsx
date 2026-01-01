"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddressFormData {
  name: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

export function AddressForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.line1 ||
        !formData.city ||
        !formData.postcode
      ) {
        toast.error("Missing Information", {
          description: "Please fill in all required fields",
        });
        setIsSubmitting(false);
        return;
      }

      // Store address in sessionStorage for checkout
      sessionStorage.setItem("checkoutAddress", JSON.stringify(formData));

      // Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Error", {
        description: "Failed to save address. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/checkout"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-zinc-400" />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Shipping Address
          </h1>
        </div>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Please provide your shipping address for delivery
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Address Line 1 */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="line1">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="line1"
              name="line1"
              type="text"
              placeholder="Street address, P.O. box"
              value={formData.line1}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Address Line 2 */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              name="line2"
              type="text"
              placeholder="Apartment, suite, unit, building, floor, etc."
              value={formData.line2}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* City and Postcode */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postcode"
                name="postcode"
                type="text"
                placeholder="400001"
                value={formData.postcode}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Country */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full"
              readOnly
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Currently, we only ship within India
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/checkout")}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Saving..." : "Continue to Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
