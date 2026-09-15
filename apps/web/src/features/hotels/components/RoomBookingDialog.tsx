"use client";

import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";

interface RoomBookingDialogProps {
  hotelId: string;
  roomTypeId: string;
}

export default function RoomBookingDialog({
  hotelId,
  roomTypeId,
}: RoomBookingDialogProps) {
  const router = useRouter();

  const handleBookRoom = () => {
    // Navigate to the account booking page
    router.push(`/book-room?hotelId=${hotelId}&roomTypeId=${roomTypeId}`);
  };

  return (
    <Button className="w-full md:w-auto bg-blue-950" onClick={handleBookRoom}>
      Select Room
    </Button>
  );
}
