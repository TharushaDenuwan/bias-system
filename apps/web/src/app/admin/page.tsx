"use client";

import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// Import your action hooks
import { useGetArticles } from "@/features/admin/article-management/api/use-get-article";
import { useGetRestaurants } from "@/features/resturant/actions/use-get-restaurant";
import { useGetReviews } from "@/features/review/actions/use-get-review";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import { useGetCashRoomBookings } from "@/features/userPayment-management/api/use-get-userPayment";

type Props = {};

export default function SuperAdminDashboard({}: Props) {
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch data using your action hooks
  const {
    data: restaurants,
    isLoading: restaurantsLoading,
    refetch: refetchRestaurants,
  } = useGetRestaurants({
    page: 1,
    limit: 100,
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetReviews({
    page: 1,
    limit: 100,
  });

  const {
    data: bookings,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useGetRoomBookings({
    page: 1,
    limit: 100,
  });

  const {
    data: cashPayments,
    isLoading: paymentsLoading,
    refetch: refetchPayments,
  } = useGetCashRoomBookings({
    page: 1,
    limit: 100,
  });

  const {
    data: articles,
    isLoading: articlesLoading,
    refetch: refetchArticles,
  } = useGetArticles({
    page: 1,
    limit: 100,
  });

  // Calculate real-time statistics
  const totalBookings = bookings?.meta?.totalCount || 0;
  const totalRestaurants = restaurants?.meta?.totalCount || 0;
  const totalReviews = reviews?.meta?.totalCount || 0;
  const totalArticles = articles?.meta?.totalCount || 0;
  const totalPayments = cashPayments?.meta?.totalCount || 0;

  // Calculate average rating
  const averageRating =
    reviews?.data?.length > 0
      ? (
          reviews.data.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          ) / reviews.data.length
        ).toFixed(1)
      : "0.0";

  // Calculate recent activity (last 7 days)
  const recentBookings =
    bookings?.data?.filter((booking: any) => {
      const bookingDate = new Date(booking.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return bookingDate >= weekAgo;
    }).length || 0;

  const recentReviews =
    reviews?.data?.filter((review: any) => {
      const reviewDate = new Date(review.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reviewDate >= weekAgo;
    }).length || 0;

  // Handle refresh
  const handleRefresh = () => {
    refetchRestaurants();
    refetchReviews();
    refetchBookings();
    refetchPayments();
    refetchArticles();
  };

  const isLoading =
    restaurantsLoading ||
    reviewsLoading ||
    bookingsLoading ||
    paymentsLoading ||
    articlesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-slate-800 bg-clip-text text-transparent">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Real-time analytics and business insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : totalBookings.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm">
                      {recentBookings} this week
                    </span>
                  </div>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Properties
                  </p>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : totalRestaurants}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm">+3.1%</span>
                  </div>
                </div>
                <Building2 className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Reviews
                  </p>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : totalReviews.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-yellow-300 text-sm">
                      {averageRating} avg rating
                    </span>
                  </div>
                </div>
                <MessageSquare className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Total Articles
                  </p>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : totalArticles}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm">+12.5%</span>
                  </div>
                </div>
                <FileText className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white transform hover:scale-105 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">
                    Cash Payments
                  </p>
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : totalPayments}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm">+8.7%</span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          {/* <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Monthly Revenue & Bookings
              </CardTitle>
              <CardDescription>
                Revenue and booking trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}

          {/* Property Distribution */}
          {/* <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Property Distribution
              </CardTitle>
              <CardDescription>Breakdown of property types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : bookings?.data?.length > 0 ? (
                  bookings.data
                    .slice(0, 5)
                    .map((booking: any, index: number) => (
                      <div
                        key={booking.id || index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {booking.userId?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              Booking #{booking.id?.slice(-6) || "N/A"}
                            </p>
                            <p className="text-xs text-slate-600">
                              {booking.createdAt
                                ? new Date(
                                    booking.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {booking.status || "Unknown"}
                        </Badge>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No bookings found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Recent Reviews
              </CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : reviews?.data?.length > 0 ? (
                  reviews.data.slice(0, 5).map((review: any, index: number) => (
                    <div
                      key={review.id || index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                            {review.userId?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {review.reviewTitle?.slice(0, 30) || "Review"}
                            {review.reviewTitle?.length > 30 ? "..." : ""}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (review.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-slate-600 ml-1">
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {review.rating || 0}/5
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No reviews found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time system activity</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Recent Bookings Activity */}
              {bookings?.data
                ?.slice(0, 2)
                .map((booking: any, index: number) => (
                  <div
                    key={`booking-${index}`}
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New booking confirmed #{booking.id?.slice(-6) || "N/A"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleTimeString()
                          : "Just now"}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Booking
                    </Badge>
                  </div>
                ))}

              {/* Recent Reviews Activity */}
              {reviews?.data?.slice(0, 2).map((review: any, index: number) => (
                <div
                  key={`review-${index}`}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New review posted - {review.rating}/5 stars
                    </p>
                    <p className="text-xs text-slate-600">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleTimeString()
                        : "Just now"}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    Review
                  </Badge>
                </div>
              ))}

              {/* Articles Activity */}
              {articles?.data
                ?.slice(0, 1)
                .map((article: any, index: number) => (
                  <div
                    key={`article-${index}`}
                    className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 hover:bg-purple-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New article published
                      </p>
                      <p className="text-xs text-slate-600">
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleTimeString()
                          : "Just now"}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      Article
                    </Badge>
                  </div>
                ))}

              {/* Restaurants Activity */}
              {restaurants?.data
                ?.slice(0, 1)
                .map((restaurant: any, index: number) => (
                  <div
                    key={`restaurant-${index}`}
                    className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 hover:bg-orange-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New property registered: {restaurant.name || "Property"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {restaurant.createdAt
                          ? new Date(restaurant.createdAt).toLocaleTimeString()
                          : "Just now"}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      Property
                    </Badge>
                  </div>
                ))}

              {/* Show loading or empty state */}
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              )}

              {!isLoading &&
                !bookings?.data?.length &&
                !reviews?.data?.length &&
                !articles?.data?.length &&
                !restaurants?.data?.length && (
                  <div className="text-center text-gray-500 py-8">
                    No recent activity
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
