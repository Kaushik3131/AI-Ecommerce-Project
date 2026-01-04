"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishDraft, discardDraft } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";

interface DraftBannerProps {
  documentId: string;
  onPublish?: () => void;
  onDiscard?: () => void;
  isChecking?: boolean;
}

export function DraftBanner({
  documentId,
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
      // Wait a bit for toast to show before refreshing
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
      // Wait a bit for toast to show before refreshing
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      toast.error(`Discard failed: ${result.error}`);
    }
  };

  // Show loading state while checking for drafts
  if (isChecking) {
    return (
      <div className="sticky top-0 z-50 border-b border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Checking for draft changes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Draft Mode
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              You have unpublished changes. Publish to make them visible to
              customers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={isDiscarding || isPublishing}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            {isDiscarding ? "Discarding..." : "Discard Draft"}
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing || isDiscarding}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            {isPublishing ? "Publishing..." : "Publish Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
