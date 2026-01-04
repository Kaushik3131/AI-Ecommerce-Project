"use client";

import { useDocument } from "@sanity/sdk-react";
import { useEffect, useState } from "react";

/**
 * Hook to detect if a document has unpublished draft changes.
 * Returns the draft document if it exists and differs from published.
 */
export function useDraftStatus(documentId: string) {
  const [hasDraft, setHasDraft] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const publishedId = documentId.replace("drafts.", "");
  const draftId = `drafts.${publishedId}`;

  // Fetch both published and draft versions
  const { data: published } = useDocument({
    documentId: publishedId,
    documentType: "order",
  });

  const { data: draft } = useDocument({
    documentId: draftId,
    documentType: "order",
  });

  useEffect(() => {
    setIsChecking(true);

    // If draft exists and is different from published, we have unpublished changes
    if (draft && published) {
      // Simple comparison - in production you might want deep equality
      const isDifferent = JSON.stringify(draft) !== JSON.stringify(published);
      setHasDraft(isDifferent);
    } else if (draft && !published) {
      // Draft exists but no published version (new document)
      setHasDraft(true);
    } else {
      // No draft or draft is identical
      setHasDraft(false);
    }

    setIsChecking(false);
  }, [draft, published]);

  return {
    hasDraft,
    isChecking,
    draftId,
    publishedId,
  };
}
