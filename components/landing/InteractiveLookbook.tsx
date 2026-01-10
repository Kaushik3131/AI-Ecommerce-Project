"use client";

import { useState } from "react";

interface Hotspot {
  id: string;
  x: string;
  y: string;
  product: {
    name: string;
    price: string;
    image?: string;
  };
}

const lookbookImages = [
  {
    id: 1,
    title: "The Golden Hour Living Room",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop",
    hotspots: [
      {
        id: "1",
        x: "30%",
        y: "60%",
        product: {
          name: "Royal Wing Chair",
          price: "₹12,499",
        },
      },
      {
        id: "2",
        x: "75%",
        y: "40%",
        product: {
          name: "Brass Floor Lamp",
          price: "₹4,999",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Royal Dining Experience",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&auto=format&fit=crop",
    hotspots: [
      {
        id: "3",
        x: "50%",
        y: "55%",
        product: {
          name: "Maharaja Dining Set",
          price: "₹42,000",
        },
      },
      {
        id: "4",
        x: "20%",
        y: "30%",
        product: {
          name: "Silk Tapestry",
          price: "₹8,500",
        },
      },
    ],
  },
];

function HotspotPoint({
  hotspot,
  isActive,
  onClick,
}: {
  hotspot: Hotspot;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="absolute z-30"
      style={{
        left: hotspot.x,
        top: hotspot.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="group relative h-4 w-4 cursor-pointer rounded-full border-2 border-(--festive-primary) bg-white shadow-lg transition-transform duration-300 hover:scale-125"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-(--festive-primary)/30" />
      </button>

      {isActive && (
        <div className="absolute bottom-6 left-1/2 z-40 mb-2 w-48 -translate-x-1/2 scale-100 transform rounded-xl border border-(--festive-gold)/20 bg-white p-3 opacity-100 shadow-xl transition-all duration-300 dark:bg-zinc-900">
          <div className="relative">
            <h4 className="mb-1 text-sm font-bold text-zinc-900 dark:text-white">
              {hotspot.product.name}
            </h4>
            <p className="text-sm font-bold text-(--festive-gold)">
              {hotspot.product.price}
            </p>
            <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-zinc-900" />
          </div>
        </div>
      )}
    </div>
  );
}

export function InteractiveLookbook() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="px-4 sm:px-8 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-(--festive-gold)/20 bg-linear-to-b from-orange-50/50 to-white p-1 shadow-xl dark:from-orange-950/10 dark:to-background">
        <div className="relative overflow-hidden rounded-[22px] py-10 md:py-14">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--festive-gold)/30 bg-(--festive-gold)/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--festive-gold) dark:text-orange-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-label="Interactive Lookbook Icon"
              >
                <title>Interactive Lookbook</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Interactive Lookbook
            </span>
            <h2 className="mb-4 font-serif text-3xl font-bold text-zinc-900 dark:text-white md:text-5xl">
              Shop the Festive Look
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Click the hotspots in the images to discover our curated Diwali
              collections. Recreate these beautiful settings in your own home.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-12">
            {lookbookImages.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-(--festive-gold)/20 shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {item.hotspots.map((hotspot) => (
                  <HotspotPoint
                    key={hotspot.id}
                    hotspot={hotspot}
                    isActive={activeHotspot === hotspot.id}
                    onClick={() =>
                      setActiveHotspot(
                        activeHotspot === hotspot.id ? null : hotspot.id,
                      )
                    }
                  />
                ))}

                <div className="absolute bottom-4 left-4 z-20">
                  <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
