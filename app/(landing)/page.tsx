import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { OfferCards } from "@/components/landing/OfferCards";
import { InteractiveLookbook } from "@/components/landing/InteractiveLookbook";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { BestSellers } from "@/components/landing/BestSellers";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { Testimonials } from "@/components/landing/Testimonials";

export const metadata: Metadata = {
  title: "Diwali Grand Sale | The Furniture Store",
  description:
    "Light up your home with handcrafted luxury furniture. Exclusive festive pricing and amazing deals.",
};

export default function LandingPage() {
  return (
    <main className="flex flex-col gap-16 pb-8 md:pb-12">
      <HeroSection />
      <OfferCards />
      <InteractiveLookbook />
      <CategoryShowcase />
      <BestSellers />
      <TrustBadges />
      <Testimonials />
    </main>
  );
}
