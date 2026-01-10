"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Truck, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 8, minutes: 45, seconds: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[200px_200px_0_0] border-2 border-(--festive-gold) bg-white/50 p-5 backdrop-blur-sm dark:bg-black/20">
      {/* Decorative top element */}
      <div className="absolute -top-1 left-1/2 h-5 w-5 -translate-x-1/2 bg-(--festive-gold) [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />

      <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-(--festive-gold)">
        Offer Ends In
      </p>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-(--festive-gold)/20 bg-zinc-900 text-xl font-bold text-(--festive-gold) shadow-lg dark:bg-zinc-800">
            {String(time.hours).padStart(2, "0")}
          </div>
          <span className="mt-1 text-[0.5625rem] font-bold uppercase text-zinc-500">
            Hrs
          </span>
        </div>
        <span className="text-xl font-bold text-(--festive-gold)">:</span>
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-(--festive-gold)/20 bg-zinc-900 text-xl font-bold text-(--festive-gold) shadow-lg dark:bg-zinc-800">
            {String(time.minutes).padStart(2, "0")}
          </div>
          <span className="mt-1 text-[0.5625rem] font-bold uppercase text-zinc-500">
            Mins
          </span>
        </div>
        <span className="text-xl font-bold text-[var(--festive-gold)]">:</span>
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-(--festive-primary) text-xl font-bold text-white shadow-lg shadow-(--festive-primary)/30 animate-pulse">
            {String(time.seconds).padStart(2, "0")}
          </div>
          <span className="mt-1 text-[0.5625rem] font-bold uppercase text-(--festive-primary)">
            Secs
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="pattern-bg relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 175, 55, 0.1) 10px, rgba(212, 175, 55, 0.1) 20px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-360 grid-cols-1 items-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-8 md:py-12">
        {/* Left Content */}
        <div className="order-2 flex flex-col justify-center gap-8 lg:order-1 lg:col-span-5">
          <div className="space-y-6">
            <Badge className="w-fit gap-2 border-red-200 bg-linear-to-r from-red-50 to-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--festive-primary)] shadow-sm dark:border-red-900 dark:from-red-950/40 dark:to-orange-950/40">
              <Flame className="h-4 w-4" />
              Shubh Deepawali Offer
            </Badge>

            <h1 className="font-serif text-5xl font-black leading-tight tracking-tight text-zinc-900 drop-shadow-sm dark:text-white xl:text-6xl">
              Diwali{" "}
              <span className="bg-linear-to-r from-[var(--festive-primary)] via-red-600 to-orange-500 bg-clip-text text-transparent">
                Grand Sale
              </span>
            </h1>

            <p className="max-w-md text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
              Light up your home with handcrafted luxury. Authentic designs,
              exclusive festive pricing, and free gold coin with premium sets.
            </p>

            <CountdownTimer />

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 border border-white/20 bg-linear-to-r from-[var(--festive-primary)] to-red-700 shadow-xl shadow-(--festive-primary)/25 transition-all hover:scale-[1.02] hover:from-red-600 hover:to-red-800 active:scale-[0.98]"
              >
                <Link href="/shop">
                  Shop Festive Deals
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-2 transition-all hover:scale-[1.02] hover:border-[var(--festive-primary)] active:scale-[0.98]"
              >
                <Link href="/contact">
                  Free Design Consult
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Design services icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-5 w-5 fill-(--festive-gold) text-(--festive-gold)" />
                <span>BIS Hallmarked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck
                  className="h-5 w-5 text-green-600"
                  aria-label="Free delivery"
                />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>10-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="order-1 relative h-[450px] overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl outline outline-1 outline-(--festive-gold)/30 dark:border-zinc-800 lg:order-2 lg:col-span-7 lg:h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* PhonePe Badge */}
          <div className="absolute left-6 top-6 z-20 flex items-center gap-3 rounded-xl border border-(--festive-gold)/40 bg-white/95 p-3 shadow-lg backdrop-blur dark:bg-zinc-900/95">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-indigo-700 text-xs font-bold text-white shadow-inner">
              ₹
            </div>
            <div className="pr-2">
              <p className="text-[0.625rem] font-bold uppercase tracking-wide text-purple-700">
                PhonePe Diwali Bash
              </p>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Flat ₹1000 Cashback
              </p>
            </div>
          </div>

          {/* Featured Collection Label */}
          <div className="absolute bottom-8 left-8 right-8 z-30">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-(--festive-gold)">
                Featured Look
              </p>
              <h3 className="mb-1 font-serif text-2xl font-bold">
                The Royal Jaipur Collection
              </h3>
              <p className="text-sm text-white/80">
                Hand-carved Sheesham wood with Rajasthani upholstery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
