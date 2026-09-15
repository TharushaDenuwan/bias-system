import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import type { RestaurantInsert } from "../schemas";

export const useCreateRestaurant = () => {
  return useMutation({
    mutationFn: async (data: RestaurantInsert) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.restaurant.$post({
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create restaurant");
      }

      return response.json();
    },
  });
};
