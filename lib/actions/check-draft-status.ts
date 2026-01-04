"use server";

import { client } from "@/sanity/lib/client";

/**
 * Server action to check if a document has unpublished draft changes.
 * This avoids client-side CORS issues on Cloud Run.
 */
export async function checkDraftStatus(documentId: string) {
  try {
    const publishedId = documentId.replace("drafts.", "");
    const draftId = `drafts.${publishedId}`;

    // Fetch both versions from server
    const [published, draft] = await Promise.all([
      client.getDocument(publishedId).catch(() => null),
      client.getDocument(draftId).catch(() => null),
    ]);

    // If draft exists and is different from published
    if (draft && published) {
      const isDifferent = JSON.stringify(draft) !== JSON.stringify(published);
      return { hasDraft: isDifferent, draftId, publishedId };
    } else if (draft && !published) {
      // Draft exists but no published version
      return { hasDraft: true, draftId, publishedId };
    }

    return { hasDraft: false, draftId, publishedId };
  } catch (error) {
    console.error("[Check Draft Status Error]:", error);
    return { hasDraft: false, draftId: "", publishedId: "" };
  }
}
