import { redirect } from "next/navigation";
import { SuccessClient } from "./SuccessClient";
import { getCheckoutSession } from "@/lib/actions/checkout";
import { cancelPendingOrder } from "@/lib/actions/cancel-order";

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

  // Check payment status
  const paymentStatus = result.session.paymentStatus?.toUpperCase();

  // Handle different payment statuses
  if (paymentStatus === "PENDING") {
    // User returned to success page but payment is still pending
    // This means they likely cancelled or navigated away from PhonePe
    // Cancel the order
    await cancelPendingOrder(orderId);

    // Redirect back to checkout with cancellation message
    redirect(`/checkout?error=payment_cancelled&orderId=${orderId}`);
  }

  if (
    paymentStatus !== "COMPLETED" &&
    paymentStatus !== "PAID" &&
    paymentStatus !== "SUCCESS"
  ) {
    // Payment failed or was cancelled
    console.error("Payment not completed:", {
      orderId,
      paymentStatus,
    });

    // Try to cancel if still pending
    await cancelPendingOrder(orderId);

    redirect(`/checkout?error=payment_failed&orderId=${orderId}`);
  }

  return <SuccessClient session={result.session} />;
}
