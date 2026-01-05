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

    const draftId = documentId.startsWith("drafts.")
      ? documentId
      : `drafts.${documentId}`;

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
      } else {
        return { success: false, error: "Document not found" };
      }
    }

    await writeClient
      .patch(draftId)
      .set({ [path]: value })
      .commit();

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

/**
 * Create a new product as a DRAFT.
 * The product won't appear on the frontend until published in Sanity Studio.
 * Returns the new product ID for navigation.
 */
export async function createProduct(name: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Create a new product as DRAFT (not published)
    const timestamp = Date.now();
    const draftId = `drafts.product-${timestamp}`;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProduct = await writeClient.create({
      _id: draftId,
      _type: "product",
      name: name,
      slug: {
        _type: "slug",
        current: `${slug}-${timestamp}`,
      },
      price: 0,
      stock: 0,
      featured: false,
      assemblyRequired: false,
    });

    revalidatePath("/admin/inventory");

    return {
      success: true,
      productId: newProduct._id,
      isDraft: true,
    };
  } catch (error: unknown) {
    console.error("[Create Product Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
