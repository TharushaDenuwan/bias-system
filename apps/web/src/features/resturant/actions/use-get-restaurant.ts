import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface RestaurantFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  userId?: string | null;
}

export const useGetRestaurants = (params: RestaurantFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc", userId } = params;

  return useQuery({
    queryKey: ["restaurants", { page, limit, search, sort, userId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const restaurantsRes = await rpcClient.api.restaurant.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!restaurantsRes.ok) {
        const errorData = await restaurantsRes.json();
        throw new Error(errorData.message || "Failed to fetch restaurants");
      }

      const restaurants = await restaurantsRes.json();

      return restaurants;
    },
  });
};
