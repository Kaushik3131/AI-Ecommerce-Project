"use client";

import { Suspense, useState } from "react";
import {
  useApplyDocumentActions,
  useDocument,
  publishDocument,
  discardDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Save, Check, Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PublishButtonProps extends DocumentHandle {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

function PublishButtonContent({
  variant = "default",
  size = "default",
  ...handle
}: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const apply = useApplyDocumentActions();

  // Get the document to check if it's a draft
  const { data: document } = useDocument(handle);

  // Check if the document is a draft by looking at the _id
  const isDraft = document?._id?.startsWith("drafts.");

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Use the base ID (without drafts. prefix) for publishing
      const baseId = handle.documentId.replace("drafts.", "");
      await apply(
        publishDocument({
          documentId: baseId,
          documentType: handle.documentType,
        }),
      );
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 2000);
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  // Only show button if there's a draft to publish
  if (!isDraft && !justPublished) {
    return null;
  }

  if (justPublished) {
    return (
      <Button variant={variant} size={size} disabled className="min-w-[140px]">
        <Check className="mr-2 h-4 w-4 text-green-500" />
        Published!
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePublish}
      disabled={isPublishing}
      className="min-w-[140px]"
    >
      {isPublishing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  );
}

function PublishButtonSkeleton() {
  return <Skeleton className="h-10 w-[140px]" />;
}

export function PublishButton(props: PublishButtonProps) {
  return (
    <Suspense fallback={<PublishButtonSkeleton />}>
      <PublishButtonContent {...props} />
    </Suspense>
  );
}

// Revert Button Component (Icon-only, destructive)
interface RevertButtonProps extends DocumentHandle {
  size?: "default" | "sm" | "lg" | "icon";
}

function RevertButtonContent({ size = "icon", ...handle }: RevertButtonProps) {
  const [isReverting, setIsReverting] = useState(false);
  const [justReverted, setJustReverted] = useState(false);
  const apply = useApplyDocumentActions();

  // Get the document to check if it's a draft
  const { data: document } = useDocument(handle);

  // Check if the document is a draft by looking at the _id
  const isDraft = document?._id?.startsWith("drafts.");

  const handleRevert = async () => {
    setIsReverting(true);
    try {
      // Use the base ID (without drafts. prefix) for discarding
      const baseId = handle.documentId.replace("drafts.", "");
      await apply(
        discardDocument({
          documentId: baseId,
          documentType: handle.documentType,
        }),
      );
      setJustReverted(true);
      setTimeout(() => setJustReverted(false), 2000);
    } catch (error) {
      console.error("Failed to revert:", error);
    } finally {
      setIsReverting(false);
    }
  };

  // Only show button if there's a draft to revert
  if (!isDraft && !justReverted) {
    return null;
  }

  if (justReverted) {
    return (
      <Button variant="outline" size={size} disabled>
        <Check className="h-4 w-4 text-green-500" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="destructive"
          size={size}
          onClick={handleRevert}
          disabled={isReverting}
        >
          {isReverting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Undo2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Discard changes</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function RevertButton(props: RevertButtonProps) {
  return (
    <Suspense fallback={null}>
      <RevertButtonContent {...props} />
    </Suspense>
  );
}
