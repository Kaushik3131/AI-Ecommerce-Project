import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DraftBannerServer } from "@/components/admin/DraftBannerServer";
import {
  PriceEditor,
  StockEditor,
  FeaturedEditor,
  DescriptionEditor,
} from "@/components/admin/inventory";
import { getProductById } from "@/lib/data/products";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch product data on the server (no CORS issues!)
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Draft Banner */}
      <DraftBannerServer documentId={id} />

      {/* Back Link */}
      <Link
        href="/admin/inventory"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Inventory
      </Link>

      {/* Product Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {product.slug?.current}
          </p>
        </div>
        <Link
          href={`/studio/structure/product;${id}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          Open in Studio
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Product Images
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {product.images?.map((image) => (
                <div
                  key={image._key}
                  className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  {image.asset?.url ? (
                    <Image
                      src={image.asset.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      No image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Description
            </h2>
            <DescriptionEditor
              documentId={id}
              currentDescription={product.description}
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          {/* Price & Stock */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Pricing & Inventory
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <PriceEditor documentId={id} currentPrice={product.price} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <StockEditor documentId={id} currentStock={product.stock} />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Product Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Category
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.category || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Material
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.material || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Color</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.color || "—"}
                </span>
              </div>
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Dimensions
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.dimensions.width} × {product.dimensions.height} ×{" "}
                    {product.dimensions.depth} cm
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Assembly Required
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.assemblyRequired ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Featured Product
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Show on homepage
                </p>
              </div>
              <FeaturedEditor
                documentId={id}
                currentFeatured={product.featured}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
