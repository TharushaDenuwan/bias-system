import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Params for adding a restaurant image
type AddRestaurantImageParams = {
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
};

export const useAddRestaurantImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageUrl,
      altText = null,
      displayOrder = null,
      isThumbnail = null,
    }: AddRestaurantImageParams) => {
      const rpcClient = await getClient();

      // Get current user's restaurant from /api/restaurant/myrestaurant
      const restaurantRes =
        await rpcClient.api.restaurant["myrestaurant"].$get();
      if (!restaurantRes.ok)
        throw new Error("Failed to fetch current user's restaurant");
      const restaurant = await restaurantRes.json();
      if (!restaurant?.id) throw new Error("No restaurant found for user");

      // Add image to restaurant
      const res = await rpcClient.api.restaurant[restaurant.id].images.$post({
        json: {
          imageUrl,
          altText,
          displayOrder,
          isThumbnail,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add restaurant image");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate images for the user's restaurant
      queryClient.invalidateQueries({
        queryKey: ["restaurant-images"],
      });
    },
  });
};
