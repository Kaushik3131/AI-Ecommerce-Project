import Link from "next/link";
import { Armchair, Bed, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const offers = [
  {
    icon: Armchair,
    title: "Flat 30% OFF on Sofas",
    description: "Upgrade your living room before the guests arrive.",
    link: "/shop?category=sofas",
    gradient:
      "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10",
    border: "border-orange-200 dark:border-orange-800/30",
    iconBg: "bg-white dark:bg-orange-900/40",
    iconColor: "text-orange-600",
    textColor: "text-orange-700 dark:text-orange-400",
    glowColor: "bg-orange-200/50 group-hover:bg-orange-300/50",
  },
  {
    icon: Bed,
    title: "Bed + Mattress Bundle",
    description: "Save ₹15,000 + Get 2 Free Pillows.",
    link: "/shop?category=beds",
    gradient:
      "from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10",
    border: "border-yellow-200 dark:border-yellow-800/30",
    iconBg: "bg-white dark:bg-yellow-900/40",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-700 dark:text-yellow-400",
    glowColor: "bg-yellow-200/50 group-hover:bg-yellow-300/50",
  },
  {
    icon: CreditCard,
    title: "No-Cost EMI",
    description: "Easy payments on all major bank cards.",
    link: "/shop",
    gradient: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10",
    border: "border-red-200 dark:border-red-800/30",
    iconBg: "bg-white dark:bg-red-900/40",
    iconColor: "text-red-600",
    textColor: "text-red-700 dark:text-red-400",
    glowColor: "bg-red-200/50 group-hover:bg-red-300/50",
  },
];

export function OfferCards() {
  return (
    <div className="mx-auto grid max-w-360 grid-cols-1 gap-6 px-4 sm:px-8 md:grid-cols-3 lg:px-8">
      {offers.map((offer) => {
        const Icon = offer.icon;
        return (
          <Link
            key={offer.title}
            href={offer.link}
            className="group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <Card
              className={`relative h-full border bg-gradient-to-br ${offer.gradient} ${offer.border} p-8`}
            >
              {/* Glow effect */}
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-colors ${offer.glowColor}`}
              />

              <CardContent className="relative flex h-full flex-col justify-between p-0">
                <div>
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-sm ${offer.iconBg} ${offer.iconColor}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-zinc-900 dark:text-white">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {offer.description}
                  </p>
                </div>

                <div
                  className={`mt-8 flex items-center gap-2 text-sm font-bold ${offer.textColor}`}
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
