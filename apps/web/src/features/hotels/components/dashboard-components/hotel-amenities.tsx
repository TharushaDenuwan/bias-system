"use client";

import { amenitiesList, AmenitiesListItem } from "@/lib/helpers/amenities-map";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";
import { useAddHotelAmenities } from "../../queries/use-add-hotel-amenities";
import { useGetHotelAmenities } from "../../queries/use-get-hotel-amenities";
import { InsertHotelAmenityType } from "../../schemas/hotel.schema";
import { AmenitiesPool } from "../amenities-pool";

type Props = {
  className?: string;
};

export function ManageHotelAmenities({ className }: Props) {
  const { data, isLoading, error } = useGetHotelAmenities();
  const { mutate, isPending } = useAddHotelAmenities();

  const [selectedAmenities, setSelectedAmenities] = useState<
    AmenitiesListItem[]
  >([]);

  useEffect(() => {
    if (data && !isLoading && !error) {
      data.map((amenity) => {
        amenitiesList.map((item) => {
          if (amenity.amenityType === item.name) {
            setSelectedAmenities((prev) => [...prev, item]);
          }
        });
      });
    }
  }, [data, isLoading, error]);

  const handleSaveChanges = () => {
    const preparedAmenities: InsertHotelAmenityType[] = selectedAmenities.map(
      (amenity) => ({
        hotelId: "",
        amenityType: amenity.name,
      })
    );

    mutate(preparedAmenities);
  };

  return (
    <Card className={cn("p-3 pt-5 rounded-sm shadow-none", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Manage Hotel Amenities</CardTitle>
        <CardDescription>
          Manage amenities for your hotel listings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <ScrollArea className="w-full h-[300px] bg-secondary/50 rounded-sm p-4">
            <div className="flex items-center flex-wrap gap-3">
              {Array(30)
                .fill("")
                .map((_, index) => (
                  <Skeleton key={index} className="w-28 h-10 rounded-md" />
                ))}
            </div>
          </ScrollArea>
        )}

        {error && <p className="text-destructive">{error.message}</p>}

        {data && (
          <AmenitiesPool
            selectedAmenities={selectedAmenities}
            onSelect={setSelectedAmenities}
          />
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-end">
        <Button
          loading={isPending}
          disabled={isPending}
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
