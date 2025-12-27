export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-24";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET?.replaceAll('"', "")
    .replaceAll("'", "")
    .trim(),
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.replaceAll('"', "")
    .replaceAll("'", "")
    .trim(),
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

// Debug: Log the actual value
console.log("SANITY_PROJECT_ID:", JSON.stringify(projectId));

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
