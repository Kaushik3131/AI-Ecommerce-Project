import { Suspense } from "react";
import { checkDraftStatus } from "@/lib/actions/check-draft-status";
import { DraftBanner } from "@/components/admin/DraftBanner";
import { writeClient } from "@/sanity/lib/client";

interface DraftBannerServerProps {
  documentId: string;
}

async function DraftBannerContent({ documentId }: DraftBannerServerProps) {
  const { hasDraft } = await checkDraftStatus(documentId);

  if (!hasDraft) return null;

  // Check if this is a new product (never been published)
  const publishedId = documentId.replace("drafts.", "");
  const publishedDoc = await writeClient
    .getDocument(publishedId)
    .catch(() => null);
  const isNewProduct = !publishedDoc; // If no published version exists, it's new

  return <DraftBanner documentId={documentId} isNewProduct={isNewProduct} />;
}

/**
 * Server component wrapper for DraftBanner.
 * Checks draft status on the server to avoid CORS issues.
 * Shows loading state while checking.
 */
export async function DraftBannerServer({
  documentId,
}: DraftBannerServerProps) {
  return (
    <Suspense
      fallback={<DraftBanner documentId={documentId} isChecking={true} />}
    >
      <DraftBannerContent documentId={documentId} />
    </Suspense>
  );
}
