// Get images for the current user's restaurant using /api/restaurant/myrestaurant then /api/restaurant/:id/images
import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

// Get current user's restaurant and its images
export const useGetCurrentUserRestaurantImages = () => {
  return useQuery({
    queryKey: ["current-user-restaurant-images"],
    queryFn: async () => {
      const rpcClient = await getClient();
      // Get current user's restaurant
      const restaurantRes =
        await rpcClient.api.restaurant["myrestaurant"].$get();
      if (!restaurantRes.ok)
        throw new Error("Failed to fetch current user's restaurant");
      const restaurant = await restaurantRes.json();
      if (!restaurant?.id) return { data: [], restaurantId: undefined };

      // Get images for that restaurant
      const imagesRes = await rpcClient.api.restaurant[
        restaurant.id
      ].images.$get({
        query: {
          page: "",
          limit: "",
          sort: "desc",
          search: "",
        },
      });
      if (!imagesRes.ok) throw new Error("Failed to fetch restaurant images");
      const imagesResult = await imagesRes.json();
      return { data: imagesResult.data, restaurantId: restaurant.id };
    },
    select: (result) => ({
      restaurantImages: result.data,
      restaurantId: result.restaurantId,
    }),
  });
};
