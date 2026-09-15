import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelImages = (roomTypeId?: string) => {
  const query = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

      if (!myHotelRes.ok) {
        throw new Error("Failed to fetch my hotel");
      }

      const myHotel = await myHotelRes.json();

      const response = await rpcClient.api.hotels[":id"].images.$get({
        param: { id: myHotel.id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel images");
      }

      const data = await response.json();

      // Only return images that don't have a roomTypeId (hotel images only)
      return data.filter((image) => image.roomTypeId === null);
    },
  });

  return query;
};
