"use client";

import RoomBookingSteps from "@/features/roomBookings/components/room-booking-steps";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = searchParams.get("hotelId");
  const roomTypeId = searchParams.get("roomTypeId");

  if (!hotelId || !roomTypeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Booking Request
          </h1>
          <p className="text-gray-600">
            Missing hotel or room type information.
          </p>
          <Button onClick={() => router.push("/account/hotels")}>
            Go Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/account/hotels");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Book Your Room</h1>
      </div>

      {/* Booking Steps */}
      <RoomBookingSteps
        hotelId={hotelId}
        roomTypeId={roomTypeId}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </div>
  );
}

export default function BookRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading booking form...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
