import { useGetHotelById } from "@/features/wishlist/actions/get-hotel-by-id";
import { CardContent } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Building2, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface WishlistCardProps {
  hotelId: string;
  className?: string;
}

export function WishlistCard({ hotelId, className }: WishlistCardProps) {
  const { data: hotel, isLoading, error } = useGetHotelById(hotelId);

  if (isLoading) {
    return <div className={cn("p-4", className)}>Loading...</div>;
  }
  if (error || !hotel) {
    return (
      <div className={cn("p-4 text-red-500", className)}>Hotel not found</div>
    );
  }

  const thumbnailImage =
    hotel.images?.find((img: any) => img.isThumbnail) || hotel.images?.[0];

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <div
        className={cn(
          "overflow-hidden border rounded-lg w-full max-w-md", // changed from max-w-sm to max-w-md
          className
        )}
      >
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
          {thumbnailImage?.imageUrl ? (
            <Image
              src={thumbnailImage.imageUrl}
              alt={thumbnailImage.altText || hotel.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
            {hotel.name || "Unnamed Hotel"}
          </h3>
          {hotel.brandName && (
            <p className="text-xs text-blue-700 font-medium line-clamp-1 mb-1">
              {hotel.brandName}
            </p>
          )}
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-600">
              {[hotel.city, hotel.country].filter(Boolean).join(", ")}
            </span>
          </div>
          {hotel.starRating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-500">
                {hotel.starRating} stars
              </span>
            </div>
          )}
          {hotel.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {hotel.description}
            </p>
          )}
        </CardContent>
      </div>
    </Link>
  );
}
