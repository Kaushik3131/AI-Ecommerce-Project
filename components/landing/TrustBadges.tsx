import { Shield, Truck, RefreshCw, Award } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "100% secure transactions with SSL encryption",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹5,000 across India",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Premium handcrafted furniture",
  },
];

export function TrustBadges() {
  return (
    <section className="mx-auto max-w-360 px-4 py-4 sm:px-8 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trustBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-all hover:border-(--festive-gold) hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-110 dark:bg-zinc-800">
                <Icon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">
                {badge.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
