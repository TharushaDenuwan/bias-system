"use client";

import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
import { useCreateWishlist } from "@/features/wishlist/actions/use-create-wishlist";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import { Card } from "@repo/ui/components/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import {
  AirVent,
  Bath,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Dumbbell,
  Eye,
  Grid3X3,
  Heart,
  MapPin,
  Minus,
  ParkingCircle,
  Plus,
  Ruler,
  Share,
  Shield,
  Star,
  TreePine,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CreateReview } from "../../review/components/create-new-review";
import RoomBookingDialog from "./RoomBookingDialog";
import { RoomDetailsPopup } from "./room-details-popup";

// Type definitions based on the API response (re-added for type safety)
type HotelType = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
};

type PropertyClass = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
};

type HotelImage = {
  id: string;
  hotelId: string;
  roomTypeId: string | null;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isThumbnail: boolean;
  createdAt: string;
  updatedAt: string;
};

type Room = {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floorNumber: number;
  isAccessible: boolean;
  status: "available" | "occupied" | "maintenance" | "out_of_order" | "dirty";
  lastCleanedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type RoomType = {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  baseOccupancy: number;
  maxOccupancy: number;
  extraBedCapacity: number;
  bedConfiguration: any;
  roomSizeSqm: string;
  viewType:
    | "ocean"
    | "city"
    | "garden"
    | "mountain"
    | "pool"
    | "courtyard"
    | "street"
    | "interior";
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type HotelData = {
  id: string;
  organizationId: string;
  createdBy: string;
  name: string;
  description: string;
  brandName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  hotelType: HotelType;
  starRating: number;
  propertyClass: PropertyClass;
  checkInTime: string;
  checkOutTime: string;
  status: "active" | "inactive" | "under_maintenance" | "pending_approval";
  createdAt: string;
  updatedAt: string;
  amenities: any[];
  images: HotelImage[];
  policies: any[];
  rooms: Room[];
  roomTypes: RoomType[];
};

// Helper function to get the icon for a room's view type
const getViewTypeIcon = (viewType: string) => {
  switch (viewType) {
    case "ocean":
      return <Waves className="w-4 h-4 text-muted-foreground" />;
    case "city":
      return <MapPin className="w-4 h-4 text-muted-foreground" />;
    case "garden":
      return <TreePine className="w-4 h-4 text-muted-foreground" />;
    case "mountain":
      return <TreePine className="w-4 h-4 text-muted-foreground" />;
    case "pool":
      return <Waves className="w-4 h-4 text-muted-foreground" />;
    case "courtyard":
      return <Eye className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Eye className="w-4 h-4 text-muted-foreground" />;
  }
};

// TODO: Replace this with the actual import if HotelData is defined elsewhere
// import type { HotelData } from 'path-to-hotel-types';

type HotelImage = {
  id: string;
  imageUrl: string;
  altText?: string;
  roomTypeId?: string;
};

type Room = {
  id: string;
  roomTypeId: string;
  status: "available" | "booked" | "maintenance";
};

type RoomType = {
  id: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  roomSizeSqm?: number;
  viewType?: string;
};

type HotelData = {
  id: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  starRating: number;
  hotelType: { name: string };
  propertyClass?: { name: string };
  rooms: Room[];
  roomTypes: RoomType[];
  images: HotelImage[];
  phone?: string;
  email?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
};

interface HotelDetailsProps {
  hotel: HotelData;
}

// Reusable Image Gallery Modal component
const ImageGalleryModal = ({
  images,
  selectedImageIndex,
  setSelectedImageIndex,
  onClose,
}: {
  images: HotelImage[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number | ((prev: number) => number)) => void;
  onClose: () => void;
}) => {
  const nextImage = () => {
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-white hover:bg-white/20"
          onClick={prevImage}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <div className="max-w-4xl max-h-full">
          <Image
            src={images[selectedImageIndex]?.imageUrl || ""}
            alt={images[selectedImageIndex]?.altText || "Hotel image"}
            width={800}
            height={600}
            className="object-contain max-w-full max-h-full"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 text-white hover:bg-white/20"
          onClick={nextImage}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Component for the booking and availability checker sidebar
const BookingAvailabilityChecker = ({ hotel }: { hotel: HotelData }) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  // Guest selection state
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const handleGuestChange = (
    type: "adults" | "children" | "rooms",
    operation: "increment" | "decrement"
  ) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? prev[type] + 1
          : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  const getGuestSummary = () => {
    let summary = `${guests.adults} adult${guests.adults > 1 ? "s" : ""}`;
    if (guests.children > 0) {
      summary += `, ${guests.children} child${guests.children > 1 ? "ren" : ""}`;
    }
    if (guests.rooms > 1) {
      summary += `, ${guests.rooms} rooms`;
    }
    return summary;
  };

  return (
    <Card className="p-6 shadow-xl border-2 sticky top-24 self-start bg-white/80 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {hotel.propertyClass?.name || "N/A"} • {hotel.rooms?.length || "0"}{" "}
            rooms
          </p>
        </div>
        <Separator />

        <div className="space-y-4">
          {/* Check-in and Check-out Date Pickers */}
          <div className="grid grid-cols-2 gap-2">
            {/* Check-in Date */}
            <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
              <PopoverTrigger asChild>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <label className="text-xs font-medium text-muted-foreground block">
                    CHECK-IN
                  </label>
                  <div className="font-semibold">
                    {checkInDate ? format(checkInDate, "MMM dd") : "Add date"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => {
                    setCheckInDate(date);
                    setIsCheckInOpen(false);
                    // Auto-open check-out if check-in is selected
                    if (date && !checkOutDate) {
                      setTimeout(() => setIsCheckOutOpen(true), 100);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Check-out Date */}
            <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
              <PopoverTrigger asChild>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <label className="text-xs font-medium text-muted-foreground block">
                    CHECK-OUT
                  </label>
                  <div className="font-semibold">
                    {checkOutDate ? format(checkOutDate, "MMM dd") : "Add date"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => {
                    setCheckOutDate(date);
                    setIsCheckOutOpen(false);
                  }}
                  disabled={(date) => date <= (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guest Selection */}
          <Popover open={isGuestOpen} onOpenChange={setIsGuestOpen}>
            <PopoverTrigger asChild>
              <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <label className="text-xs font-medium text-muted-foreground block">
                  GUESTS
                </label>
                <div className="font-semibold">{getGuestSummary()}</div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-muted-foreground">
                        Ages 13 or above
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleGuestChange("adults", "decrement")}
                        disabled={guests.adults <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {guests.adults}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleGuestChange("adults", "increment")}
                        disabled={guests.adults >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-muted-foreground">
                        Ages 0-12
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() =>
                          handleGuestChange("children", "decrement")
                        }
                        disabled={guests.children <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {guests.children}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() =>
                          handleGuestChange("children", "increment")
                        }
                        disabled={guests.children >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rooms</div>
                      <div className="text-sm text-muted-foreground">
                        Number of rooms
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleGuestChange("rooms", "decrement")}
                        disabled={guests.rooms <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {guests.rooms}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => handleGuestChange("rooms", "increment")}
                        disabled={guests.rooms >= 8}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button
                    className="w-full"
                    onClick={() => setIsGuestOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            className="w-full py-3 text-lg font-semibold bg-dark-blue hover:bg-dark-blue/90 text-white"
            disabled={!checkInDate || !checkOutDate}
          >
            Check availability
          </Button>

          {/* Map Section */}
          <div className="border rounded-lg p-3 mt-4">
            <label className="text-xs font-medium text-muted-foreground">
              LOCATION
            </label>
            <div className="w-full h-64 rounded-lg overflow-hidden mt-2">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${hotel.latitude},${hotel.longitude}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        <Separator />
      </div>
    </Card>
  );
};

// Component for displaying the list of available rooms
const RoomListSection = ({ hotel }: { hotel: HotelData }) => {
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-dark-blue">Available Rooms</h2>
      <div className="space-y-6">
        {hotel.roomTypes.length > 0 ? (
          hotel.roomTypes.map((roomType) => {
            const roomsOfType = hotel.rooms.filter(
              (r: { roomTypeId: any }) => r.roomTypeId === roomType.id
            );
            const availableRooms = roomsOfType.filter(
              (r: { status: string }) => r.status === "available"
            ).length;

            // Find an image for the room type, if available
            const roomImage = hotel.images.find(
              (img: { roomTypeId: any }) => img.roomTypeId === roomType.id
            );

            return (
              <div className="relative">
                <Card
                  key={roomType.id}
                  className="p-4 md:p-6 hover:shadow-lg transition-shadow bg-pastel-light-blue cursor-pointer"
                  onClick={() => setSelectedRoomType(roomType.id as string)}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {roomImage && (
                      <div className="w-full md:w-1/3 flex-shrink-0 relative h-48 md:h-auto rounded-lg overflow-hidden">
                        <Image
                          src={roomImage.imageUrl}
                          alt={
                            typeof roomType.name === "string"
                              ? roomType.name
                              : String(roomType.name ?? "Room image")
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-4">
                      <h3 className="text-xl font-semibold text-dark-blue">
                        {roomType.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {roomType.description || "Description not available."}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-dark-blue/80">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {roomType.maxOccupancy} guests
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-blue/80">
                          <Ruler className="w-4 h-4" />
                          <span className="text-sm">
                            {roomType.roomSizeSqm || "N/A"} m²
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-blue/80">
                          {getViewTypeIcon(roomType.viewType ?? "")}
                          <span className="text-sm capitalize">
                            {roomType.viewType || "No"} view
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-blue/80">
                          <Tv className="w-4 h-4" />
                          <span className="text-sm">TV</span>{" "}
                          {/* Example amenity */}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-sm text-green-700 font-medium">
                          {availableRooms} available
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          • {roomsOfType.length} total rooms
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-end justify-center z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RoomBookingDialog
                        hotelId={hotel.id}
                        roomTypeId={roomType.id ? String(roomType.id) : ""}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            );
          })
        ) : (
          <p className="text-lg text-muted-foreground">
            No room types available at this time.
          </p>
        )}
      </div>

      {/* Room Details Popup */}
      <RoomDetailsPopup
        roomTypeId={selectedRoomType || ""}
        isOpen={!!selectedRoomType}
        onClose={() => setSelectedRoomType(null)}
        onBookNow={(roomTypeId) => {
          setSelectedRoomType(null);
          // Handle booking logic
          console.log("Booking room type:", roomTypeId);
        }}
      />
    </div>
  );
};

function ReviewList({ hotelId }: { hotelId?: string }) {
  // Get hotelId from URL if not provided
  let resolvedHotelId = hotelId;
  if (!resolvedHotelId && typeof window !== "undefined") {
    const match = window.location.pathname.match(/hotels\/([a-zA-Z0-9-]+)/);
    resolvedHotelId = match ? match[1] : undefined;
  }

  const { data, isLoading, error } = useGetReviewsByHotelId({
    hotelId: resolvedHotelId || "",
    page: 1,
    limit: 10,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Failed to load reviews.</p>
      </div>
    );

  const reviews = data?.data || [];

  if (reviews.length === 0)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-lg text-gray-500">No reviews yet.</p>
      </div>
    );

  // Helper function to get rating color and text for 5-star system
  const getRatingDisplay = (rating: number) => {
    if (rating >= 4.5)
      return {
        bg: "bg-green-600",
        text: "Excellent",
        textColor: "text-green-600",
      };
    if (rating >= 4)
      return {
        bg: "bg-green-500",
        text: "Very good",
        textColor: "text-green-500",
      };
    if (rating >= 3)
      return {
        bg: "bg-yellow-500",
        text: "Good",
        textColor: "text-yellow-600",
      };
    if (rating >= 2)
      return {
        bg: "bg-orange-500",
        text: "Fair",
        textColor: "text-orange-600",
      };
    return { bg: "bg-red-500", text: "Poor", textColor: "text-red-600" };
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <svg
              className="w-4 h-4 text-gray-300 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => {
        const ratingInfo = getRatingDisplay(review.rating);

        return (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div className="p-6">
              {/* Header with rating and date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Rating score */}
                  <div
                    className={`${ratingInfo.bg} text-white font-bold text-sm px-2 py-1 rounded-md min-w-[2.5rem] text-center`}
                  >
                    {review.rating}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>

                  {/* Rating text and title */}
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-sm ${ratingInfo.textColor}`}
                    >
                      {ratingInfo.text}
                    </span>
                    {review.reviewTitle && (
                      <span className="font-medium text-gray-900 text-base mt-1">
                        {review.reviewTitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date */}
                <span className="text-sm text-gray-500">
                  {review.reviewDate
                    ? new Date(review.reviewDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>

              {/* Review content */}
              <div className="space-y-3">
                {review.reviewPositiveText && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1">
                      {review.reviewPositiveText}
                    </p>
                  </div>
                )}

                {review.reviewNegativeText && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1">
                      {review.reviewNegativeText}
                    </p>
                  </div>
                )}
              </div>

              {/* Property response */}
              {review.propertyResponse && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-900 text-sm mb-1">
                          Property response
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.propertyResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Main component
export function HotelDetailsComponent({ hotel }: HotelDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  const createWishlist = useCreateWishlist();
  const deleteWishlist = useDeleteWishlist();

  const allImages = hotel.images.filter((img) => !img.roomTypeId);

  // Wishlist handler (toggle)
  const handleWishlistClick = async () => {
    if (!hotel?.id) return;
    if (!wishlistAdded) {
      // Create wishlist
      try {
        const result = await createWishlist.mutateAsync({ hotelId: hotel.id });
        setWishlistId(result?.id ?? null);
        setWishlistAdded(true);
      } catch (err) {
        // Optionally show error
      }
    } else {
      // Delete wishlist
      try {
        await deleteWishlist.mutateAsync(wishlistId ?? hotel.id);
        setWishlistAdded(false);
        setWishlistId(null);
      } catch (err) {
        // Optionally show error
      }
    }
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: `Check out ${hotel.name} in ${hotel.city}, ${hotel.country}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const sampleAmenities = [
    { name: "Free WiFi", icon: <Wifi className="w-5 h-5 text-dark-blue/80" /> },
    {
      name: "Swimming Pool",
      icon: <Waves className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Fitness Center",
      icon: <Dumbbell className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Restaurant",
      icon: <Utensils className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Free Parking",
      icon: <ParkingCircle className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Air Conditioning",
      icon: <AirVent className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Room Service",
      icon: <Coffee className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Private Bathroom",
      icon: <Bath className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "Flat-screen TV",
      icon: <Tv className="w-5 h-5 text-dark-blue/80" />,
    },
    {
      name: "24-hour Security",
      icon: <Shield className="w-5 h-5 text-dark-blue/80" />,
    },
  ];

  const handleShowOnMap = () => {
    if (hotel.latitude && hotel.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`,
        "_blank"
      );
    } else {
      alert("Map location not available for this hotel.");
    }
  };

  return (
    <div className="min-h-screen bg-pastel-gray text-dark-blue">
      {isGalleryOpen && (
        <ImageGalleryModal
          images={allImages}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
      {/* Hero Section with Hotel Images */}
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-auto lg:h-[500px] rounded-xl overflow-hidden">
          {allImages.slice(0, 5).map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "relative cursor-pointer group",
                index === 0
                  ? "md:col-span-2 lg:col-span-2 lg:row-span-2 h-[300px] md:h-[500px]"
                  : "h-[200px] md:h-[250px] lg:h-auto"
              )}
              onClick={() => {
                setSelectedImageIndex(index);
                setIsGalleryOpen(true);
              }}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `Hotel image ${index + 1}`}
                fill
                className="object-cover group-hover:brightness-90 transition-all"
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
              />
              {index === 4 && allImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center">
                  <div className="space-y-1">
                    <Grid3X3 className="w-6 h-6 mx-auto" />
                    <span className="text-sm font-medium">
                      +{allImages.length - 5} photos
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {allImages.length > 0 && (
          <Button
            variant="outline"
            className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm shadow-md text-dark-blue"
            onClick={() => setIsGalleryOpen(true)}
          >
            <Camera className="w-4 h-4 mr-2" />
            Show all photos
          </Button>
        )}
      </div>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-4xl font-bold text-dark-blue">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-2 ml-4">
                  {/* Wishlist Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlistClick}
                    disabled={
                      createWishlist.isLoading || deleteWishlist.isLoading
                    }
                    className={cn(
                      "px-3 py-2 h-10 transition-colors flex items-center gap-2",
                      wishlistAdded
                        ? "text-red-500 border-red-200 hover:bg-red-50"
                        : "text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-all",
                        wishlistAdded
                          ? "fill-red-500 text-red-500"
                          : "fill-transparent"
                      )}
                    />
                    {wishlistAdded ? "Saved" : "Save"}
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="px-3 py-2 h-10 text-gray-500 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {hotel.city}, {hotel.state}, {hotel.country}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-700"
                  onClick={handleShowOnMap}
                >
                  Show on map
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {hotel.hotelType.name}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-pastel-light-blue text-dark-blue">
                <TabsTrigger
                  value="rooms"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-blue-700 after:to-blue-200 after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
                >
                  Rooms
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-blue-700 after:to-blue-200 after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="amenities"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-blue-700 after:to-blue-200 after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:scale-x-0 after:bg-gradient-to-r after:from-blue-700 after:to-blue-200 after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="mt-8">
                <RoomListSection hotel={hotel} />
              </TabsContent>

              <TabsContent value="details" className="mt-8 space-y-6">
                <h2 className="text-2xl font-bold text-dark-blue">
                  Property Description
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {hotel.description || "Description not available."}
                </p>
                <Separator />
                <h2 className="text-2xl font-bold text-dark-blue">
                  Check-in & Check-out
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Check-in</p>
                      <p className="text-muted-foreground">
                        {hotel.checkInTime || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Check-out</p>
                      <p className="text-muted-foreground">
                        {hotel.checkOutTime || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-8 space-y-6">
                <h2 className="text-2xl font-bold text-dark-blue">
                  What this place offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleAmenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-pastel-gray rounded-lg"
                    >
                      {amenity.icon}
                      <span className="text-base text-dark-blue/90">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-blue">
                    Guest Reviews
                  </h2>
                  <div className="ml-auto">
                    {/* Create Review Button floating at top right */}
                    <CreateReview hotelId={hotel.id} />
                  </div>
                </div>
                <ReviewList hotelId={hotel.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar Column */}
          <div className="hidden lg:block">
            <BookingAvailabilityChecker hotel={hotel} />
          </div>
        </div>

        {/* Map View Section */}
        {/* <div className="mt-6">
          <h3 className="text-lg font-semibold text-dark-blue mb-2">
            Hotel Location
          </h3>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${hotel.latitude},${hotel.longitude}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div> */}
      </div>
      \
    </div>
  );
}
