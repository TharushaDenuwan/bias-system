"use client";

import { useSearchParams } from "next/navigation";
import { useGetDestinations } from "../actions/get-action";
import { destination } from "../schemas";
import { DestinationCard } from "./destination-card";
import { DestinationPagination } from "./destination-pagination";
import { SearchBar } from "./search-bar";

export function DestinationList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const { data, isLoading, isError } = useGetDestinations({
    page,
    limit: 10,
    sort: "desc",
    search,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading destinations...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load destinations.
      </div>
    );
  }

  const destinations: destination[] = data.data || [];
  const meta = data.meta || { currentPage: 1, totalPages: 1 };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Destinations</h2>
        <SearchBar />
      </div>
      <div className="flex flex-col gap-4">
        {destinations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No destinations found.
          </div>
        ) : (
          destinations.map((item) => (
            <DestinationCard key={item.id} destination={item} />
          ))
        )}
      </div>
      <DestinationPagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
