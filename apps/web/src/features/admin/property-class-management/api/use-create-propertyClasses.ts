import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export interface CreatePropertyClassInput {
  name: string;
  thumbnail?: string | null;
}

export const useCreatePropertyClass = () => {
  return useMutation({
    mutationFn: async (input: CreatePropertyClassInput) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["property-classes"].$post({
        json: {
          name: input.name,
          thumbnail: input.thumbnail ?? null,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create property class");
      }
      return await res.json();
    },
  });
};
