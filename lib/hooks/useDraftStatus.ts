"use client";

import { useEffect, useState } from "react";
import { checkDraftStatus } from "@/lib/actions/check-draft-status";

/**
 * Hook to detect if a document has unpublished draft changes.
 * Uses server action to avoid CORS issues on Cloud Run.
 */
export function useDraftStatus(documentId: string) {
  const [hasDraft, setHasDraft] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [draftId, setDraftId] = useState("");
  const [publishedId, setPublishedId] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      setIsChecking(true);
      const result = await checkDraftStatus(documentId);

      if (mounted) {
        setHasDraft(result.hasDraft);
        setDraftId(result.draftId);
        setPublishedId(result.publishedId);
        setIsChecking(false);
      }
    }

    checkStatus();

    return () => {
      mounted = false;
    };
  }, [documentId]);

  return {
    hasDraft,
    isChecking,
    draftId,
    publishedId,
  };
}
