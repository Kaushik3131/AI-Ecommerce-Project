import { Suspense } from "react";
import { checkDraftStatus } from "@/lib/actions/check-draft-status";
import { DraftBanner } from "@/components/admin/DraftBanner";

interface DraftBannerServerProps {
  documentId: string;
}

async function DraftBannerContent({ documentId }: DraftBannerServerProps) {
  const { hasDraft } = await checkDraftStatus(documentId);

  if (!hasDraft) return null;

  return <DraftBanner documentId={documentId} />;
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
