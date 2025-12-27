// components/sanity/SanityClientProvider.tsx
"use client";

import { ResourceProvider } from "@sanity/sdk-react";

export function SanityClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResourceProvider
      projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
      dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
      fallback={<div />}
    >
      {children}
    </ResourceProvider>
  );
}
