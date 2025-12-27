"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  useDocument,
  useQuery,
  deleteDocument,
  discardDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteButtonProps {
  handle: DocumentHandle;
  redirectTo?: string;
}

function DeleteButtonContent({
  handle,
  redirectTo = "/admin/inventory",
}: DeleteButtonProps) {
  const router = useRouter();
  const apply = useApplyDocumentActions();

  const baseId = handle.documentId.replace("drafts.", "");

  // Real-time document state
  const { data: doc } = useDocument(handle);

  // Check if published version exists
  const { data: publishedDoc } = useQuery<{ _id: string } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: baseId },
    perspective: "published",
  });

  // Check if any orders reference this product
  const { data: referencingOrders } = useQuery<{ _id: string }[]>({
    query: `*[_type == "order" && references($id)]{ _id }`,
    params: { id: baseId },
  });

  const isDraft = doc?._id?.startsWith("drafts.");
  const hasPublishedVersion = !!publishedDoc;
  const hasReferences = referencingOrders && referencingOrders.length > 0;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this product permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      if (hasPublishedVersion) {
        const result = await apply(
          deleteDocument({
            documentId: baseId,
            documentType: handle.documentType,
          }),
        );
        await result.submitted();
      } else if (isDraft) {
        const result = await apply(
          discardDocument({
            documentId: baseId,
            documentType: handle.documentType,
          }),
        );
        await result.submitted();
      }
      router.push(redirectTo);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // If orders reference this product, redirect to Studio for safe deletion
  if (hasReferences) {
    const orderCount = referencingOrders?.length ?? 0;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1.5" asChild>
              <Link
                href={`/studio/structure/${handle.documentType};${baseId}`}
                target="_blank"
              >
                <Trash2 className="h-4 w-4" />
                Delete in Studio
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              This product is referenced by {orderCount} order
              {orderCount !== 1 ? "s" : ""}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // No references - can delete directly
  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-1.5"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}

function DeleteButtonFallback() {
  return <Skeleton className="h-9 w-20" />;
}

export function DeleteButton(props: DeleteButtonProps) {
  return (
    <Suspense fallback={<DeleteButtonFallback />}>
      <DeleteButtonContent {...props} />
    </Suspense>
  );
}
