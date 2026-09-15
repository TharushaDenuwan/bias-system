import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export interface CreateHotelTypeInput {
  name: string;
  thumbnail?: string | null;
}

export const useCreateHotelType = () => {
  return useMutation({
    mutationFn: async (input: CreateHotelTypeInput) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["hotels"]["types"].$post({
        json: {
          name: input.name,
          thumbnail: input.thumbnail ?? null,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create hotel type");
      }
      return await res.json();
    },
  });
};
