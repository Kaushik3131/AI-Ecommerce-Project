import { Flame } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-800 via-[var(--festive-primary)] to-red-800 text-white">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 175, 55, 0.1) 10px, rgba(212, 175, 55, 0.1) 20px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2">
        <Flame className="h-4 w-4 animate-pulse text-yellow-300" />
        <p className="text-center text-xs font-bold uppercase tracking-wide sm:text-sm">
          Shubh Diwali Sale Is Live! Extra 15% off via UPI
        </p>
        <Flame className="h-4 w-4 animate-pulse text-yellow-300" />
      </div>
    </div>
  );
}
