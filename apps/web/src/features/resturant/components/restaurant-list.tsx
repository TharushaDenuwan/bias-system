"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useGetRestaurants } from "../actions/use-get-restaurant";
import type { Restaurant } from "../schemas";
import { RestaurantCard } from "./restaurant-card";
import { RestaurantPagination } from "./restaurant-pagination";
import { SearchBar } from "./search-bar";

export function RestaurantList({
  onSelectRestaurantType,
}: {
  onSelectRestaurantType?: (id: string) => void;
}) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  // Get current session user using authClient
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data, isLoading, isError } = useGetRestaurants({
    page,
    limit: 10,
    sort: "desc",
    search,
    userId,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading restaurants...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load restaurants.
      </div>
    );
  }

  // Only show restaurants created by the current user
  const restaurants: Restaurant[] = (data.data || []).filter(
    (item) => item.createdBy === userId
  );
  const meta = data.meta || { currentPage: 1, totalPages: 1 };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Restaurants</h2>
        <SearchBar />
      </div>
      <div className="flex flex-col gap-4">
        {restaurants.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No restaurants found.
          </div>
        ) : (
          restaurants.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRestaurantType?.(item.id)}
              className="cursor-pointer"
            >
              <RestaurantCard restaurant={item} />
            </div>
          ))
        )}
      </div>
      <RestaurantPagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
