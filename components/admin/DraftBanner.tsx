"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ExternalLink,
  XCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishDraft, discardDraft } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";
import Link from "next/link";

interface DraftBannerProps {
  documentId: string;
  isNewProduct?: boolean; // True if product has never been published
  onPublish?: () => void;
  onDiscard?: () => void;
  isChecking?: boolean;
}

export function DraftBanner({
  documentId,
  isNewProduct = false,
  onPublish,
  onDiscard,
  isChecking,
}: DraftBannerProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    const result = await publishDraft(documentId);
    setIsPublishing(false);

    if (result.success) {
      toast.success("Changes published successfully!");
      onPublish?.();
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      toast.error(`Publish failed: ${result.error}`);
    }
  };

  const handleDiscard = async () => {
    setIsDiscarding(true);
    const result = await discardDraft(documentId);
    setIsDiscarding(false);

    if (result.success) {
      toast.success("Draft discarded - reverted to published version");
      onDiscard?.();
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      toast.error(`Discard failed: ${result.error}`);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Checking for changes...
        </span>
      </div>
    );
  }

  const publishedId = documentId.replace("drafts.", "");
  const studioUrl = `/studio/structure/product;${publishedId}`;

  // For new products, show "Complete in Studio" workflow
  if (isNewProduct) {
    const handleCompleteInStudio = () => {
      // Open Studio in new tab
      window.open(studioUrl, "_blank");
      // Navigate back to inventory list
      router.push("/admin/inventory");
    };

    return (
      <div className="flex flex-col gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-orange-900 dark:text-orange-100">
              New Product Draft
            </p>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
              Complete setup in Sanity Studio to add images, category, and
              publish.
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={isDiscarding}
            className="border-orange-300 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900"
          >
            {isDiscarding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Delete Draft
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleCompleteInStudio}
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            Complete in Studio
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // For existing products with changes, show "Publish Changes" workflow
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-orange-900 dark:text-orange-100">
            Unpublished Changes
          </p>
          <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
            You have unpublished changes to this product. Publish to make them
            live.
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={isDiscarding}
          className="border-orange-300 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900"
        >
          {isDiscarding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Discarding...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Discard
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
