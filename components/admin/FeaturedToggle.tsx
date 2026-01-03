"use client";

import { Suspense, useState, useEffect } from "react";
import { useDocument, type DocumentHandle } from "@sanity/sdk-react";
import { updateAdminDocument } from "@/lib/actions/admin-actions";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FeaturedToggleProps extends DocumentHandle {}

function FeaturedToggleContent(handle: FeaturedToggleProps) {
  const { data: featured } = useDocument({ ...handle, path: "featured" });
  const [isSaving, setIsSaving] = useState(false);

  const isFeatured = !!featured;

  const handleToggle = async () => {
    setIsSaving(true);
    const result = await updateAdminDocument(
      handle.documentId,
      "featured",
      !isFeatured,
    );
    setIsSaving(false);

    if (!result.success) {
      toast.error(`Toggle failed: ${result.error}`);
    } else {
      toast.success(
        !isFeatured ? "Added to featured" : "Removed from featured",
      );
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
      disabled={isSaving}
      title={isFeatured ? "Remove from featured" : "Add to featured"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isSaving && "animate-pulse",
          isFeatured
            ? "fill-amber-400 text-amber-400"
            : "text-zinc-300 dark:text-zinc-600",
        )}
      />
    </Button>
  );
}

function FeaturedToggleSkeleton() {
  return <Skeleton className="h-8 w-8" />;
}

export function FeaturedToggle(props: FeaturedToggleProps) {
  return (
    <Suspense fallback={<FeaturedToggleSkeleton />}>
      <FeaturedToggleContent {...props} />
    </Suspense>
  );
}
