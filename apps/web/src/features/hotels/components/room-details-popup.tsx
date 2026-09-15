"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Dialog, DialogContent } from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import {
  BedDouble,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useGetRoomTypeByID } from "../queries/use-get-room-type-by-id";
import { useGetRoomTypeImages } from "../queries/use-get-room-type-images-by-id";

interface RoomDetailsPopupProps {
  roomTypeId: string;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (roomTypeId: string) => void;
}

export function RoomDetailsPopup({
  roomTypeId,
  isOpen,
  onClose,
  onBookNow,
}: RoomDetailsPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: roomDetails, isLoading: loading } = useGetRoomTypeByID(
    isOpen ? roomTypeId : null
  );
  const { data: roomImages } = useGetRoomTypeImages(isOpen ? roomTypeId : null);

  const nextImage = () => {
    if (!roomImages?.data) return;
    setCurrentImageIndex((prev) =>
      prev === roomImages.data.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!roomImages?.data) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? roomImages.data.length - 1 : prev - 1
    );
  };

  const getAvailableRooms = () => {
    if (!roomDetails?.rooms) return 0;
    return roomDetails.rooms.filter((room) => room.status === "available")
      .length;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0
          h-auto
          max-w-[90vw]
          md:max-w-7xl
          overflow-y-auto
          rounded-lg
          shadow-xl
        "
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#003580]" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 flex flex-col gap-2 overflow-hidden">
              {roomImages?.data && roomImages.data.length > 0 ? (
                <>
                  {/* Main Hero Image */}
                  <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-l-lg">
                    <Image
                      src={roomImages.data[currentImageIndex].imageUrl}
                      alt={
                        roomImages.data[currentImageIndex].altText ||
                        "Room image"
                      }
                      fill
                      className="object-cover rounded-l-lg"
                    />

                    {/* Navigation buttons */}
                    {roomImages.data.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-20"
                          onClick={previousImage}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-20"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails under the main image */}
                  {roomImages.data.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto mt-2 px-1">
                      {roomImages.data.map((img, index) => (
                        <div
                          key={img.id || index}
                          className={`relative h-20 w-28 rounded-lg overflow-hidden cursor-pointer border-2 ${
                            index === currentImageIndex
                              ? "border-[#003580] ring-2 ring-[#003580]"
                              : "border-gray-200"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={img.imageUrl}
                            alt={img.altText || `Room image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-l-lg">
                  No images available
                </div>
              )}
            </div>

            {/* Right: Room Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-[#003580]">
                {roomDetails?.name}
              </h2>
              <p className="text-gray-600">{roomDetails?.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarClock className="w-4 h-4" />
                <span>
                  Added on{" "}
                  {roomDetails?.createdAt && formatDate(roomDetails.createdAt)}
                </span>
              </div>

              <Separator />

              {/* Room Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg">Room Specifications</h3>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>
                      Occupancy: {roomDetails?.baseOccupancy} -{" "}
                      {roomDetails?.maxOccupancy} guests
                    </span>
                  </div>
                  {roomDetails?.roomSizeSqm && (
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-gray-500" />
                      <span>Room Size: {roomDetails.roomSizeSqm} m²</span>
                    </div>
                  )}
                  {roomDetails?.bedConfiguration && (
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-gray-500" />
                      <span>Bed: {roomDetails.bedConfiguration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-gray-500" />
                    <span>View: {roomDetails?.viewType}</span>
                  </div>
                </div>

                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg">Additional Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {roomDetails?.extraBedCapacity && (
                      <Badge variant="secondary">
                        Extra bed available (+{roomDetails.extraBedCapacity})
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {roomDetails?.status ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {getAvailableRooms()} rooms available
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {roomDetails?.amenities?.length > 0 && (
                <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-lg">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roomDetails.amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-1 text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="capitalize">
                          {amenity.amenityType.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Section */}
              <div className="mt-auto flex items-center justify-between p-4 border-t bg-white sticky bottom-0">
                <div>
                  {roomDetails?.price ? (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-[#003580]">
                        ${roomDetails.price}
                      </p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Price on request</p>
                  )}
                </div>
                {/* <Button
                  className="bg-[#003580] hover:bg-[#002157] text-white px-6 py-2"
                  onClick={() => onBookNow?.(roomTypeId)}
                >
                  Book Now
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
