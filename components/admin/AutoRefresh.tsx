"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  children: React.ReactNode;
  intervalMs?: number;
}

export function AutoRefresh({
  children,
  intervalMs = 30000,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return <>{children}</>;
}
