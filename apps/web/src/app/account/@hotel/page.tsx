// import { SignoutButton } from "@/features/auth/components/signout-button";

// type Props = {};

// export default function HotelPage({}: Props) {
//   return (
//     <div>
//       HotelPage
//       <SignoutButton />
//     </div>
//   );
// }
"use client";

import { useGetHotels } from "@/features/admin/hotel-management/api/use-get-hotels";
import { useGetPropertyClasses } from "@/features/hotels/queries/use-get-property-classes";
import { useGetRestaurants } from "@/features/resturant/actions/use-get-restaurant";
import { useGetReviews } from "@/features/review/actions/use-get-review";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useMemo } from "react";

export default function HotelDashboard() {
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviews({
    page: 1,
    limit: 10,
  });
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useGetRestaurants({ page: 1, limit: 10 });
  const { data: propertyClassesData, isLoading: propertyClassesLoading } =
    useGetPropertyClasses();
  const { data: hotelsData, isLoading: hotelsLoading } = useGetHotels({
    page: 1,
    limit: 10,
  });
  const { data: roomBookingsData, isLoading: roomBookingsLoading } =
    useGetRoomBookings({ page: 1, limit: 10 });

  const totalReviews = reviewsData?.meta?.totalCount || 0;
  const totalRestaurants = restaurantsData?.meta?.totalCount || 0;
  const totalPropertyClasses =
    propertyClassesData?.meta?.totalCount ||
    propertyClassesData?.data?.length ||
    0;
  const totalHotels = hotelsData?.meta?.totalCount || 0;

  // Example: Prepare data for a bar chart (replace with your chart lib if needed)
  const chartData = useMemo(
    () => [
      { label: "Reviews", value: totalReviews },
      { label: "Restaurants", value: totalRestaurants },
      { label: "Property Classes", value: totalPropertyClasses },
      { label: "Hotels", value: totalHotels },
    ],
    [totalReviews, totalRestaurants, totalPropertyClasses, totalHotels]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-white to-[#b2f7ef] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#003580] mb-8">
          Dashboard Overview
        </h1>
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 flex flex-col items-center justify-center bg-white/80 shadow-lg">
            <BarChart2 className="w-8 h-8 text-[#003580] mb-2" />
            <div className="text-2xl font-bold text-[#003580]">
              {totalReviews}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center bg-white/80 shadow-lg">
            <Utensils className="w-8 h-8 text-[#003580] mb-2" />
            <div className="text-2xl font-bold text-[#003580]">
              {totalRestaurants}
            </div>
            <div className="text-sm text-gray-600">Total Restaurants</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center bg-white/80 shadow-lg">
            <Star className="w-8 h-8 text-[#003580] mb-2" />
            <div className="text-2xl font-bold text-[#003580]">
              {totalPropertyClasses}
            </div>
            <div className="text-sm text-gray-600">Property Classes</div>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center bg-white/80 shadow-lg">
            <BarChart2 className="w-8 h-8 text-[#003580] mb-2" />
            <div className="text-2xl font-bold text-[#003580]">
              {totalHotels}
            </div>
            <div className="text-sm text-gray-600">Total Hotels</div>
          </Card>
        </div> */}

        {/* Simple Bar Chart (replace with chart lib for more features) */}
        {/* <div className="bg-white/80 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#003580] mb-4">
            Summary Chart
          </h2>
          <div className="flex items-end gap-8 h-40">
            {chartData.map((item) => (
              <div key={item.label} className="flex flex-col items-center w-24">
                <div
                  className="w-12 rounded bg-[#003580] mb-2 transition-all"
                  style={{ height: `${Math.max(item.value, 8) * 2}px` }}
                />
                <span className="text-sm text-gray-700 font-semibold">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500">{item.value}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Recent Reviews Table */}
        <div className="bg-white/80 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#003580] mb-4">
            Recent Reviews
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Positive</TableHead>
                <TableHead>Negative</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                reviewsData?.data?.slice(0, 5).map((review: any) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.reviewTitle}</TableCell>
                    <TableCell>{review.reviewPositiveText}</TableCell>
                    <TableCell>{review.reviewNegativeText}</TableCell>
                    <TableCell>
                      {review.reviewDate
                        ? new Date(review.reviewDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Recent Restaurants Table */}
        {/* <div className="bg-white/80 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#003580] mb-4">
            Recent Restaurants
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurantsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                restaurantsData?.data?.slice(0, 5).map((restaurant: any) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.city}</TableCell>
                    <TableCell>{restaurant.country}</TableCell>
                    <TableCell>{restaurant.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div> */}

        {/* Property Classes Table */}
        {/* <div className="bg-white/80 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#003580] mb-4">
            Property Classes
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertyClassesLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                (propertyClassesData?.data || []).slice(0, 5).map((pc: any) => (
                  <TableRow key={pc.id}>
                    <TableCell>{pc.name}</TableCell>
                    <TableCell>
                      {pc.createdAt
                        ? new Date(pc.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div> */}

        {/* Room Bookings Table */}
        <div className="bg-white/80 rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-[#003580] mb-4">
            Recent Room Bookings
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomBookingsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                roomBookingsData?.data?.slice(0, 5).map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.hotelId}</TableCell>
                    <TableCell>{booking.roomId}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
