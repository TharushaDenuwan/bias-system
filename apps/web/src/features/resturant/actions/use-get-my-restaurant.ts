import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyRestaurant = () => {
  return useQuery({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.restaurant["myrestaurant"].$get();
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch restaurant");
      }
      return res.json();
    },
  });
};
