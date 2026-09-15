import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetRoomBookings = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["roomBookings", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const roomBookingsRes = await rpcClient.api["room-bookings"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!roomBookingsRes.ok) {
        const errorData = await roomBookingsRes.json();
        throw new Error("Failed to fetch roomBookings");
      }

      const roomBookings = await roomBookingsRes.json();

      return roomBookings;
    },
  });

  return query;
};
