import Link from "next/link";
import { Sofa, BedDouble, Utensils, Shirt, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Sofas",
    price: "From ₹15,999",
    icon: Sofa,
    slug: "sofas",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
  },
  {
    name: "Beds",
    price: "From ₹24,999",
    icon: BedDouble,
    slug: "beds",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop",
  },
  {
    name: "Dining",
    price: "From ₹18,999",
    icon: Utensils,
    slug: "dining",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop",
  },
  {
    name: "Wardrobes",
    price: "From ₹21,999",
    icon: Shirt,
    slug: "wardrobes",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop",
  },
];

export function CategoryShowcase() {
  return (
    <section className="px-4 sm:px-8 lg:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--festive-primary)]">
            Our Collections
          </span>
          <h3 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Shop by Category
          </h3>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-bold text-[var(--festive-primary)] transition-colors hover:text-red-700 md:flex"
        >
          See All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-100 shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Background image or icon */}
              <div className="h-full w-full bg-zinc-200 transition-transform duration-700 group-hover:scale-110 dark:bg-zinc-700">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 z-20 w-full p-4 text-white">
                <p className="mb-1 font-serif text-xl font-bold transition-colors group-hover:text-[var(--festive-gold)]">
                  {category.name}
                </p>
                <p className="w-fit rounded bg-white/10 px-2 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {category.price}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
