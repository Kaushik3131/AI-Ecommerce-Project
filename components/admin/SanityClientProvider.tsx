// components/admin/SanityClientProvider.tsx
"use client";

import { ResourceProvider } from "@sanity/sdk-react";

export function SanityClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add a client-side check to prevent SSR issues
  if (typeof window === "undefined") {
    return <div className="p-8">Loading...</div>;
  }

  // Validate environment variables
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;

  if (!projectId || !dataset) {
    console.error("Missing Sanity configuration:", {
      projectId: projectId ? "✓" : "✗",
      dataset: dataset ? "✓" : "✗",
      token: token ? "✓" : "✗",
    });
    return (
      <div className="p-8 text-red-600">
        Error: Sanity configuration is missing. Please check your environment
        variables.
      </div>
    );
  }

  return (
    <ResourceProvider
      projectId={projectId}
      dataset={dataset}
      auth={token ? { token } : undefined}
      fallback={<div className="p-8">Loading...</div>}
    >
      {children}
    </ResourceProvider>
  );
}
