// "use client";

// import { format } from "date-fns";
// import Link from "next/link";

// import { SignoutButton } from "@/features/auth/components/signout-button";
// import { useGetRoomBookingsByUser } from "@/features/userBooking-management/api/get-room-bookings-by-user-id";
// import { authClient } from "@/lib/auth-client";
// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import { Card } from "@repo/ui/components/card";
// import { Separator } from "@repo/ui/components/separator";
// import { Skeleton } from "@repo/ui/components/skeleton";

// type Props = {};

// export default function UserAccountPage({}: Props) {
//   // Move session hook inside component
//   const { data: session, status } = authClient.useSession();

//   const userId = session?.user?.id;

//   const {
//     data: bookingsRes,
//     isLoading,
//     error,
//   } = useGetRoomBookingsByUser(userId, {
//     page: 1,
//     limit: 6,
//     sort: "desc",
//   });

//   const bookings = bookingsRes?.data || [];

//   const welcomeName = session?.user?.name || session?.user?.email || "Guest";

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Welcome back, {welcomeName}</h1>
//           <p className="text-sm text-muted-foreground">
//             {session?.user?.email}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <SignoutButton />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold">Your recent bookings</h2>
//                 <p className="text-sm text-muted-foreground">
//                   A quick overview of your latest bookings
//                 </p>
//               </div>
//               <div className="text-right">
//                 <Link href="/account/booking-details">
//                   <Button variant="ghost">View all</Button>
//                 </Link>
//               </div>
//             </div>

//             <Separator className="my-4" />

//             {status === "loading" || isLoading ? (
//               <div className="space-y-3">
//                 <Skeleton className="h-12 w-full rounded-lg" />
//                 <Skeleton className="h-12 w-full rounded-lg" />
//                 <Skeleton className="h-12 w-full rounded-lg" />
//               </div>
//             ) : error ? (
//               <div className="text-red-600">Failed to load bookings.</div>
//             ) : bookings.length === 0 ? (
//               <div className="text-center py-12">
//                 <h3 className="text-lg font-semibold">No bookings yet</h3>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   Start your first booking to see it here.
//                 </p>
//                 <div className="mt-6 flex justify-center">
//                   <Link href="/search">
//                     <Button className="px-6">Start your first booking</Button>
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {bookings.map((b: any) => (
//                   <BookingItem key={b.id} booking={b} />
//                 ))}
//               </div>
//             )}
//           </Card>

//           {/* Additional personalized content can go here */}
//         </div>

//         <aside className="space-y-6">
//           <Card className="p-6">
//             <h3 className="text-lg font-semibold">Account</h3>
//             <div className="mt-4">
//               <p className="text-sm text-muted-foreground">Signed in as</p>
//               <div className="mt-2 flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">{welcomeName}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {session?.user?.email}
//                   </div>
//                 </div>
//                 <div>
//                   <Badge variant="secondary">Member</Badge>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <h3 className="text-lg font-semibold">Quick actions</h3>
//             <div className="mt-4 space-y-2">
//               <Link href="/search">
//                 <Button className="w-full">Search hotels</Button>
//               </Link>
//               <Link href="/account/booking-details">
//                 <Button variant="outline" className="w-full">
//                   Manage bookings
//                 </Button>
//               </Link>
//             </div>
//           </Card>
//         </aside>
//       </div>
//     </div>
//   );
// }

// function BookingItem({ booking }: { booking: any }) {
//   const checkIn = booking.checkInDate
//     ? format(new Date(booking.checkInDate), "MMM dd, yyyy")
//     : "—";
//   const checkOut = booking.checkOutDate
//     ? format(new Date(booking.checkOutDate), "MMM dd, yyyy")
//     : "—";

//   return (
//     <div className="border rounded-lg p-4 flex items-center justify-between">
//       <div>
//         <div className="flex items-center gap-2">
//           <h4 className="font-medium">{booking.guestName || "Booking"}</h4>
//           <Badge
//             variant={
//               booking.status === "confirmed"
//                 ? "default"
//                 : booking.status === "pending"
//                   ? "secondary"
//                   : "destructive"
//             }
//           >
//             {booking.status}
//           </Badge>
//         </div>
//         <div className="text-sm text-muted-foreground mt-1">
//           {checkIn} — {checkOut}
//         </div>
//         <div className="text-sm text-muted-foreground mt-2">
//           Rooms:{" "}
//           {Array.isArray(booking.rooms)
//             ? booking.rooms.length
//             : booking.numRooms || 1}
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <Link href={`/account/booking/${booking.id}`}>
//           <Button variant="ghost">View</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";

import { format } from "date-fns";
import Link from "next/link";

import { SignoutButton } from "@/features/auth/components/signout-button";
import { useGetRoomBookingsByUser } from "@/features/userBooking-management/api/get-room-bookings-by-user-id";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";

type Props = {};

export default function UserAccountPage({}: Props) {
  const { data: session, status } = authClient.useSession();
  const userId = session?.user?.id;

  const {
    data: bookingsRes,
    isLoading,
    error,
  } = useGetRoomBookingsByUser(userId, {
    page: 1,
    limit: 6,
    sort: "desc",
  });

  const bookings = bookingsRes?.data || [];
  const welcomeName = session?.user?.name || session?.user?.email || "Guest";

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {welcomeName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Welcome back,{" "}
                  <span className="text-gray-700">{welcomeName}</span>
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-lg p-1">
                <SignoutButton />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Active Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Member Status
                    </p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Premium
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        bookings.filter((b) => {
                          const bookingDate = new Date(b.checkInDate);
                          const currentMonth = new Date().getMonth();
                          return bookingDate.getMonth() === currentMonth;
                        }).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bookings Section */}
          <div className="lg:col-span-3">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Recent Bookings
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Your latest reservations and stays
                    </p>
                  </div>
                  <Link href="/account/booking-details">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-sm text-sm px-3 py-2">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-4">
                {status === "loading" || isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-16 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Unable to load bookings
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Please try refreshing the page
                    </p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
                      Ready to start your journey? Book your first stay and
                      create unforgettable memories.
                    </p>
                    <Link href="/search">
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 shadow-sm text-sm">
                        Start Your First Booking
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b: any, index: number) => (
                      <div
                        key={b.id}
                        className="opacity-0 animate-fadeInUp"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <BookingItem booking={b} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Account Details */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Account Details
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {welcomeName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">
                      {welcomeName}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      {session?.user?.email}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    Premium
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link href="/search">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-sm text-sm py-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search Hotels
                  </Button>
                </Link>
                <Link href="/account/booking-details">
                  <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 text-sm py-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Manage Bookings
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Activity
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Booking confirmed</span>
                    <span className="text-gray-400 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Profile updated</span>
                    <span className="text-gray-400 ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-600">Payment processed</span>
                    <span className="text-gray-400 ml-auto">3d ago</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Support Card */}
            <Card className="bg-gray-900 border-gray-800 text-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold">Need Help?</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      We're here to assist
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 text-sm py-2">
                    Contact Support
                  </Button>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 text-sm py-2">
                    View FAQ
                  </Button>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function BookingItem({ booking }: { booking: any }) {
  const checkIn = booking.checkInDate
    ? format(new Date(booking.checkInDate), "MMM dd, yyyy")
    : "—";
  const checkOut = booking.checkOutDate
    ? format(new Date(booking.checkOutDate), "MMM dd, yyyy")
    : "—";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "pending":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {booking.guestName || "Hotel Booking"}
              </h4>
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
              >
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <span className="font-medium text-gray-900">Check-in:</span>
                <div className="text-gray-600">{checkIn}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <span className="font-medium text-gray-900">Check-out:</span>
                <div className="text-gray-600">{checkOut}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium text-gray-900">Rooms:</span>
            <span className="text-gray-600">
              {Array.isArray(booking.rooms)
                ? booking.rooms.length
                : booking.numRooms || 1}
            </span>
          </div>
        </div>

        <div className="ml-4">
          <Link href={`/account/booking-details/${booking.id}`}>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm text-sm px-3 py-2">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
