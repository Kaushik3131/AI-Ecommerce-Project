import { checkDraftStatus } from "@/lib/actions/check-draft-status";
import { DraftBanner } from "@/components/admin/DraftBanner";

interface DraftBannerServerProps {
  documentId: string;
}

/**
 * Server component wrapper for DraftBanner.
 * Checks draft status on the server to avoid CORS issues.
 */
export async function DraftBannerServer({
  documentId,
}: DraftBannerServerProps) {
  const { hasDraft } = await checkDraftStatus(documentId);

  if (!hasDraft) return null;

  return <DraftBanner documentId={documentId} />;
}
