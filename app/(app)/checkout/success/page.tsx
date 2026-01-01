import { redirect } from "next/navigation";
import { SuccessClient } from "./SuccessClient";
import { getCheckoutSession } from "@/lib/actions/checkout";
// import { markOrderAsPaid } from "@/lib/actions/complete-order"; // Disabled for Cloud Run

export const metadata = {
  title: "Order Confirmed | AI-Ecom-Store",
  description: "Your order has been placed successfully",
};

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string; // PhonePe merchant order ID
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  const orderId = params.orderId;

  if (!orderId) {
    redirect("/");
  }

  // For local testing: Manually mark order as paid
  // In production (Cloud Run), the PhonePe webhook will do this
  // DISABLED FOR CLOUD RUN - Webhook will handle order completion
  // await markOrderAsPaid(orderId);

  const result = await getCheckoutSession(orderId);

  if (!result.success || !result.session) {
    redirect("/");
  }

  // Check if payment was actually successful
  const paymentStatus = result.session.paymentStatus?.toUpperCase();

  if (paymentStatus !== "COMPLETED" && paymentStatus !== "PAID") {
    // Payment failed or is still pending - redirect to checkout with error
    console.error("Payment not completed:", {
      orderId,
      paymentStatus,
    });
    redirect(`/checkout?error=payment_failed&orderId=${orderId}`);
  }

  return <SuccessClient session={result.session} />;
}
