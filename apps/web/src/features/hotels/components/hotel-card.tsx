"use client";

import { useCreateWishlist } from "@/features/wishlist/actions/use-create-wishlist";
import { useDeleteWishlist } from "@/features/wishlist/actions/use-delete-wishlist";
import { CardContent } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Building2, Crown, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Sample hotel data based on the provided JSON
const sampleHotel = {
  id: "e035107f-4056-4819-9418-351f537dcd70",
  name: "Hotel Tharu",
  brandName: "Tharu Hotels & Resorts",
  description:
    "Experience luxury and comfort in the heart of Kandy, offering spectacular views and world-class amenities.",
  street: "123 Ocean Drive",
  city: "Kandy",
  country: "Sri Lanka",
  starRating: 5,
  hotelType: {
    name: "5 star",
  },
  propertyClass: {
    name: "luxury",
  },
  images: [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      altText: "Hotel Exterior",
      isThumbnail: false,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      altText: "Hotel Pool",
      isThumbnail: false,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      altText: "Hotel Room",
      isThumbnail: false,
    },
  ],
};

type HotelCardProps = {
  hotel?: Partial<typeof sampleHotel>;
  className?: string;
};

export function HotelCard({ hotel = sampleHotel, className }: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const createWishlist = useCreateWishlist();
  const deleteWishlist = useDeleteWishlist();

  // Format location string
  const getLocationString = () => {
    const parts = [hotel?.street, hotel?.city, hotel?.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not available";
  };

  // Handle image cycling on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (
      hotel?.images &&
      Array.isArray(hotel.images) &&
      hotel.images.length > 1
    ) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % (hotel.images?.length || 1)
        );
      }, 800);

      setTimeout(() => {
        clearInterval(interval);
        setIsHovered(false);
      }, 2400); // Show 3 images then stop
    }
  };

  const hasValidImages =
    Array.isArray(hotel?.images) && hotel.images.length > 0;
  const currentImage = hasValidImages
    ? hotel.images?.[currentImageIndex]
    : null;

  // Wishlist handler (toggle)
  const handleWishlistClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hotel?.id) return;
    if (!wishlistAdded) {
      // Create wishlist
      try {
        const result = await createWishlist.mutateAsync({ hotelId: hotel.id });
        // If your API returns the wishlist id, set it here
        setWishlistId(result?.id ?? null);
        setWishlistAdded(true);
      } catch (err) {
        // Optionally show error
      }
    } else {
      // Delete wishlist
      try {
        // Use wishlistId if available, else fallback to hotel.id
        await deleteWishlist.mutateAsync(wishlistId ?? hotel.id);
        setWishlistAdded(false);
        setWishlistId(null);
      } catch (err) {
        // Optionally show error
      }
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Wishlist Icon */}
      <button
        type="button"
        aria-label="Add to wishlist"
        className={cn(
          "absolute z-20 top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-pink-100 transition-colors",
          wishlistAdded ? "text-pink-500" : "text-gray-400"
        )}
        onClick={handleWishlistClick}
        disabled={createWishlist.isLoading || deleteWishlist.isLoading}
      >
        <Heart
          className={cn(
            "h-4.5 w-4.5 transition-all",
            wishlistAdded
              ? "fill-red-500 text-red-500 border-none"
              : "fill-white stroke-[1] stroke-black" // Decreased border line weight
          )}
          style={wishlistAdded ? { border: "none" } : undefined}
        />
      </button>
      <Link href={`/hotels/${hotel.id}`}>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-sm rounded-lg w-full max-w-sm",
            className
          )}
          onMouseEnter={handleMouseEnter}
        >
          {/* Image Section */}
          <div className="relative h-40 w-full overflow-hidden">
            {currentImage?.imageUrl ? (
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.altText || hotel?.name || "Hotel Image"}
                fill
                className="object-cover transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
            )}

            {/* Image counter dots */}
            {hasValidImages && hotel.images && hotel.images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {Array.from({ length: hotel.images.length }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <CardContent className="p-3">
            {/* Hotel Name */}
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {hotel?.name || "Not available"}
            </h3>

            {/* Brand Name */}
            {hotel?.brandName && (
              <div className="flex items-center gap-1.5 mb-2">
                <Crown className="h-3.5 w-3.5 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium line-clamp-1">
                  {hotel.brandName}
                </p>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 line-clamp-1">
                {getLocationString()}
              </p>
            </div>

            {/* Description */}
            {hotel?.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {hotel.description}
              </p>
            )}

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-2">
              {hotel?.starRating && hotel.starRating > 0 ? (
                <>
                  {[...Array(Math.min(hotel.starRating, 5))].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 text-amber-400 fill-amber-400"
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    (
                    {hotel.starRating === 1
                      ? "1 Visitor"
                      : `${hotel.starRating} Visitor's`}
                    )
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400">
                  No rating available
                </span>
              )}
            </div>

            {/* Hotel Type and Property Class */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {hotel?.hotelType?.name && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-900" />
                    <span className="text-xs font-medium text-blue-900">
                      {hotel.hotelType.name}
                    </span>
                  </div>
                )}
              </div>

              {hotel?.propertyClass?.name && (
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium capitalize">
                    {hotel.propertyClass.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Link>
    </div>
  );
}

// Demo component to show different states
export default function HotelCardDemo() {
  const emptyHotel = {
    id: "empty-hotel",
    name: "",
    brandName: "",
    description: "",
    street: "",
    city: "",
    country: "",
    starRating: 0,
    hotelType: { name: "" },
    propertyClass: { name: "" },
    images: [],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Sample Hotel */}
        <HotelCard />

        {/* Hotel with different data */}
        <HotelCard
          hotel={{
            ...sampleHotel,
            name: "Gold Cabana & Villa",
            brandName: "Gold Hotels International",
            description:
              "A premium retreat offering luxury accommodations with traditional Sri Lankan hospitality.",
            city: "Kandy",
            country: "Sri Lanka",
            starRating: 4,
            hotelType: { name: "4 star" },
            propertyClass: { name: "premium" },
          }}
        />

        {/* Empty data example */}
        <HotelCard hotel={emptyHotel} />
      </div>
    </div>
  );
}
