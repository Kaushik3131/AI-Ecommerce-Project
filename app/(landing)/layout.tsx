import { Header } from "@/components/app/Header";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { Footer } from "@/components/landing/Footer";
import { CartSheet } from "@/components/app/CartSheet";
import { ChatSheet } from "@/components/app/ChatSheet";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";
import { AppShell } from "@/components/app/AppShell";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="pattern-bg flex min-h-screen flex-col">
        <PromoBanner />
        <Header />
        {children}
        <Footer />
      </div>
      <CartSheet />
      <ChatSheet />
      <Toaster position="bottom-center" />
      <SanityLive />
    </AppShell>
  );
}
