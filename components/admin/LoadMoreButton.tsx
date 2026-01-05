"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  currentPage: number;
  search?: string;
}

export function LoadMoreButton({ currentPage, search }: LoadMoreButtonProps) {
  const router = useRouter();

  const handleLoadMore = () => {
    // Build the URL for the next page
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(currentPage + 1));

    // Navigate without scrolling to top
    router.push(`/admin/inventory?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-4 flex justify-center">
      <Button variant="outline" onClick={handleLoadMore}>
        Load More
      </Button>
    </div>
  );
}
