import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface StackedProductImagesProps {
  images: string[];
  /** Total number of items (used to calculate "+X more" count) */
  totalCount?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to animate on hover (requires parent with group class) */
  hoverScale?: boolean;
}

const sizeConfig = {
  sm: {
    container: "h-12 w-12",
    single: "100%",
    stacked: "36px",
    offset: 4,
    icon: "h-5 w-5",
    fontSize: "text-[10px]",
    imageSizes: "48px",
  },
  md: {
    container: "h-16 w-16",
    single: "100%",
    stacked: "48px",
    offset: 5,
    icon: "h-6 w-6",
    fontSize: "text-xs",
    imageSizes: "64px",
  },
  lg: {
    container: "h-20 w-20",
    single: "100%",
    stacked: "56px",
    offset: 6,
    icon: "h-8 w-8",
    fontSize: "text-xs",
    imageSizes: "80px",
  },
};

export function StackedProductImages({
  images,
  totalCount,
  size = "sm",
  hoverScale = true,
}: StackedProductImagesProps) {
  const config = sizeConfig[size];
  const displayImages = images.slice(0, 3);
  const extraCount = (totalCount ?? images.length) - displayImages.length;

  const hoverClass = hoverScale
    ? "transition-transform duration-200 group-hover:scale-105"
    : "";

  if (displayImages.length === 0) {
    return (
      <div
        className={`relative flex items-center justify-center ${config.container}`}
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700 ${hoverClass}`}
        >
          <ShoppingBag className={`${config.icon} text-zinc-400`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${config.container}`}
    >
      <div className="relative h-full w-full">
        {displayImages.map((imageUrl, idx) => (
          <div
            key={imageUrl}
            className={`absolute overflow-hidden rounded-lg border-2 border-white bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-700 ${hoverClass}`}
            style={{
              width:
                displayImages.length === 1 ? config.single : config.stacked,
              height:
                displayImages.length === 1 ? config.single : config.stacked,
              top: displayImages.length === 1 ? 0 : `${idx * config.offset}px`,
              left: displayImages.length === 1 ? 0 : `${idx * config.offset}px`,
              zIndex: displayImages.length - idx,
            }}
          >
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes={config.imageSizes}
            />
          </div>
        ))}
        {extraCount > 0 && displayImages.length > 1 && (
          <div
            className={`absolute flex items-center justify-center rounded-lg border-2 border-white bg-zinc-200 font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-600 dark:text-zinc-300 ${config.fontSize}`}
            style={{
              width: config.stacked,
              height: config.stacked,
              top: `${Math.min(displayImages.length, 2) * config.offset}px`,
              left: `${Math.min(displayImages.length, 2) * config.offset}px`,
              zIndex: 0,
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
}
