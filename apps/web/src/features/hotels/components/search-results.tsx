"use client";

import { HotelSelectType } from "@/features/hotels/schemas/hotel.schema";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";
import { HotelCard } from "./hotel-card";

type SearchResultsProps = {
  hotels: HotelSelectType[];
  isLoading?: boolean;
};

export function SearchResults({
  hotels,
  isLoading = false
}: SearchResultsProps) {
  // Animation for results appearance
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-[350px]">
              <Skeleton className="w-full h-48" />
              <div className="mt-3 space-y-2">
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <div
            key={hotel.id}
            className={cn(
              "transition-all duration-300 ease-out",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <HotelCard
              hotel={hotel}
              className="h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
