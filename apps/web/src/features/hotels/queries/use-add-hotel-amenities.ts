import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { InsertHotelAmenityType } from "../schemas/hotel.schema";

import { getClient } from "@/lib/rpc/client";

export const useAddHotelAmenities = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (amenities: InsertHotelAmenityType[]) => {
      const rpcClient = await getClient();

      const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

      if (!myHotelRes.ok) {
        throw new Error("Failed to fetch my hotel");
      }

      const myHotel = await myHotelRes.json();

      if (!myHotel) throw new Error("Hotel not found");

      const preparedAmenities = amenities.map((amenty) => ({
        hotelId: myHotel.id,
        amenityType: amenty.amenityType
      }));

      const response = await rpcClient.api.hotels[":id"].amenities.$post({
        param: { id: myHotel.id },
        json: preparedAmenities
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update hotel amenities"
        );
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Hotel amenities are updating...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Hotel amenities updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["hotels", "amenities"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update hotel amenities", {
        id: toastId
      });
    }
  });

  return mutation;
};
