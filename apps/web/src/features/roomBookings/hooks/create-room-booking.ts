import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

export interface CreateRoomBookingInput {
  hotelId: string;
  roomTypeId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  numRooms?: number;
  numAdults?: number;
  numChildren?: number;
  totalAmount?: string;
  currency?: string;
  specialRequests?: string;
  notes?: string;
  paymentDetails?: any;
}

export const useCreateRoomBooking = () => {
  return useMutation({
    mutationFn: async (input: CreateRoomBookingInput) => {
      const rpcClient = await getClient();
      const res = await rpcClient.api["room-bookings"].$post({
        json: input,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create room booking");
      }
      return res.json();
    },
  });
};
