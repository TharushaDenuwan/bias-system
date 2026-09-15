import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyHotel = () => {
  return useQuery({
    queryKey: ["my-hotel"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.hotels["my-hotel"].$get({
        query: {},
      });
      if (!response.ok) {
        throw new Error("Failed to fetch my hotel");
      }
      return await response.json();
    },
  });
};
