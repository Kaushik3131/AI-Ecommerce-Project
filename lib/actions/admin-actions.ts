"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action to update Sanity documents.
 * This bypasses client-side CORS and uses the secure SANITY_API_TOKEN.
 */
export async function updateAdminDocument(
  documentId: string,
  path: string,
  value: any,
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Ensure we are patching a draft
    const draftId = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

    // Check if draft exists, if not, create it from the published version
    const existingDraft = await writeClient
      .getDocument(draftId)
      .catch(() => null);

    if (!existingDraft) {
      const publishedId = documentId.replace("drafts.", "");
      const publishedDoc = await writeClient
        .getDocument(publishedId)
        .catch(() => null);

      if (publishedDoc) {
        await writeClient.create({
          ...publishedDoc,
          _id: draftId,
        });
      }
    }

    // Perform the update
    await writeClient
      .patch(draftId)
      .set({ [path]: value })
      .commit();

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${documentId.replace("drafts.", "")}`);

    return { success: true };
  } catch (error: any) {
    console.error("[Admin Mutation Error]:", error);
    return { success: false, error: error.message };
  }
}
