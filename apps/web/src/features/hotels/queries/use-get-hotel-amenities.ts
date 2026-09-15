import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetHotelAmenities = () => {
  const query = useQuery({
    queryKey: ["hotels", "amenities"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

      if (!myHotelRes.ok) {
        throw new Error("Failed to fetch my hotel");
      }

      const myHotel = await myHotelRes.json();

      const amenitiesRes = await rpcClient.api.hotels[":id"].amenities.$get({
        param: { id: myHotel.id }
      });

      if (!amenitiesRes.ok) {
        const errorData = await amenitiesRes.json();
        throw new Error(errorData.message || "Failed to fetch hotel images");
      }

      const data = await amenitiesRes.json();

      return data;
    }
  });

  return query;
};
