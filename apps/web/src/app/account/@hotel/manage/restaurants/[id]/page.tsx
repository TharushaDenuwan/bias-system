"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant-detail", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await fetch(`/api/restaurant/${restaurantId}`);
      if (!res.ok) throw new Error("Failed to fetch restaurant");
      return res.json();
    },
  });

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (error || !restaurant) {
    return (
      <div className="text-red-500">Failed to load restaurant details.</div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{restaurant.name}</CardTitle>
        <div className="text-muted-foreground">{restaurant.status}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="font-semibold">Description:</span>
          <p>{restaurant.description ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Brand Name:</span>
          <p>{restaurant.brandName ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Address:</span>
          <p>
            {restaurant.street}, {restaurant.city}, {restaurant.state},{" "}
            {restaurant.country}, {restaurant.postalCode}
          </p>
        </div>
        <div>
          <span className="font-semibold">Contact:</span>
          <p>Phone: {restaurant.phone ?? "—"}</p>
          <p>Email: {restaurant.email ?? "—"}</p>
          <p>Website: {restaurant.website ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Star Rating:</span>
          <p>{restaurant.starRating ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Check In Time:</span>
          <p>{restaurant.checkInTime ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Check Out Time:</span>
          <p>{restaurant.checkOutTime ?? "—"}</p>
        </div>
        <div>
          <span className="font-semibold">Created At:</span>
          <p>{restaurant.createdAt}</p>
        </div>
        <div>
          <span className="font-semibold">Updated At:</span>
          <p>{restaurant.updatedAt ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
