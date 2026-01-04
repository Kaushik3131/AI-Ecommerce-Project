"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

/**
 * Update a field in the DRAFT version of a document.
 * This allows admin to stage changes before publishing them live.
 */
export async function updateDraftField(
  documentId: string,
  path: string,
  value: unknown,
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Always work with drafts
    const draftId = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

    // Check if draft exists
    const existingDraft = await writeClient
      .getDocument(draftId)
      .catch(() => null);

    if (!existingDraft) {
      // Get published doc and create draft
      const publishedId = documentId.replace("drafts.", "");
      const publishedDoc = await writeClient
        .getDocument(publishedId)
        .catch(() => null);

      if (publishedDoc) {
        await writeClient.create({
          ...publishedDoc,
          _id: draftId,
        });
      } else {
        return { success: false, error: "Document not found" };
      }
    }

    // Update the draft
    await writeClient
      .patch(draftId)
      .set({ [path]: value })
      .commit();

    // Revalidate admin pages only (not customer-facing pages)
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${documentId.replace("drafts.", "")}`);

    return { success: true, isDraft: true };
  } catch (error: unknown) {
    console.error("[Update Draft Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Publish a draft document to make changes live.
 * This is the atomic operation that moves draft -> published.
 */
export async function publishDraft(documentId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const publishedId = documentId.replace("drafts.", "");
    const draftId = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

    // Get the draft
    const draft = await writeClient.getDocument(draftId).catch(() => null);
    if (!draft) {
      return { success: false, error: "No draft found to publish" };
    }

    // Create a transaction to atomically publish
    const transaction = writeClient.transaction();

    // Copy draft content to published document
    transaction.createOrReplace({
      ...draft,
      _id: publishedId,
    });

    // Delete the draft
    transaction.delete(draftId);

    // Execute transaction
    await transaction.commit();

    // Revalidate both admin and customer-facing pages
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${publishedId}`);
    revalidatePath("/orders");
    revalidatePath(`/orders/${publishedId}`);

    return { success: true, published: true };
  } catch (error: unknown) {
    console.error("[Publish Draft Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Discard a draft and revert to the published version.
 */
export async function discardDraft(documentId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const draftId = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

    // Delete the draft
    await writeClient.delete(draftId);

    // Revalidate admin pages
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${documentId.replace("drafts.", "")}`);

    return { success: true, discarded: true };
  } catch (error: unknown) {
    console.error("[Discard Draft Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
