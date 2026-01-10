"use client";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: {
    text: string;
    color: string;
  };
}

const bestSellers: Product[] = [
  {
    id: 1,
    name: "Royal Wing Chair",
    price: "₹12,499",
    originalPrice: "₹24,999",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
    badge: {
      text: "50% Off",
      color: "bg-red-600",
    },
  },
  {
    id: 2,
    name: "L-Shaped Sofa",
    price: "₹35,999",
    originalPrice: "₹55,000",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop",
    badge: {
      text: "Best Seller",
      color: "bg-amber-500",
    },
  },
  {
    id: 3,
    name: "Teak Wood Bed",
    price: "₹28,499",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "6-Seater Dining",
    price: "₹42,000",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop",
    badge: {
      text: "Premium",
      color: "bg-purple-600",
    },
  },
];

export function BestSellers() {
  return (
    <section className="px-4 sm:px-8 lg:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Best Sellers
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Customer favorites this festive season
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {bestSellers.map((product) => (
          <div
            key={product.id}
            className="group relative aspect-3/4 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-100 shadow-md dark:border-zinc-700 dark:bg-zinc-800"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

            {/* Background image */}
            <div className="h-full w-full bg-zinc-200 transition-transform duration-700 group-hover:scale-110 dark:bg-zinc-700">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${product.image}')` }}
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute left-4 top-4 z-20">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${product.badge.color}`}
                >
                  {product.badge.text}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 z-20 w-full p-4 text-white">
              <p className="mb-1 font-serif text-xl font-bold transition-colors group-hover:text-(--festive-gold)">
                {product.name}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="w-fit rounded bg-white/10 px-2 py-1 text-sm font-bold text-white backdrop-blur-sm">
                  {product.price}
                </p>
                {product.originalPrice && (
                  <span className="text-xs opacity-70 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
