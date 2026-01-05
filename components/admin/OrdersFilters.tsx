"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSearch } from "@/components/admin";
import { ORDER_STATUS_TABS } from "@/lib/constants/orderStatus";

export function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(initialSearch);

  const updateFilters = (newStatus?: string, newSearch?: string) => {
    const params = new URLSearchParams();
    const status = newStatus ?? statusFilter;
    const search = newSearch ?? searchValue;

    if (status && status !== "all") params.set("status", status);
    if (search) params.set("search", search);

    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    updateFilters(undefined, searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <AdminSearch
        placeholder="Search by order # or email..."
        value={searchValue}
        onChange={setSearchValue}
        onBlur={handleSearchSubmit}
        onKeyDown={handleKeyDown}
        className="w-full sm:max-w-xs"
      />
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => updateFilters(value, undefined)}
        >
          <TabsList className="w-max">
            {ORDER_STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs sm:text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
