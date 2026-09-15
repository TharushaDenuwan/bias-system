// "use client";

// import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
// import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { useState } from "react";

// export default function ReviewsPage() {
//   const [page, setPage] = useState(1);
//   const { data: hotelData, isLoading: isLoadingHotel } = useGetMyHotel();
//   const hotelId = hotelData?.id || hotelData?.hotel?.id; // support both possible shapes
//   const { data, isLoading, isError, error } = useGetReviewsByHotelId({
//     hotelId,
//     page,
//   });

//   if (isLoadingHotel) {
//     return (
//       <div className="container mx-auto py-8">
//         <Card className="rounded-sm bg-secondary/45">
//           <CardHeader>
//             <CardTitle>Hotel Reviews</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="h-20 bg-muted animate-pulse rounded" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!hotelId) {
//     return (
//       <div className="container mx-auto py-8">
//         <Card className="rounded-sm bg-secondary/45">
//           <CardHeader>
//             <CardTitle>Hotel Reviews</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-12 text-muted-foreground">
//               No hotel found.
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <Card className="rounded-sm bg-secondary/45">
//         <CardHeader>
//           <CardTitle>Hotel Reviews</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="h-20 bg-muted animate-pulse rounded" />
//               ))}
//             </div>
//           ) : isError ? (
//             <div className="text-center text-destructive">
//               {error?.message || "Failed to load reviews."}
//             </div>
//           ) : data?.data && data.data.length > 0 ? (
//             <div className="space-y-6">
//               {data.data.map((review: any) => (
//                 <Card key={review.id} className="rounded bg-background">
//                   <CardHeader className="flex flex-row items-center gap-4">
//                     <div className="flex flex-col">
//                       <span className="font-semibold">
//                         {review.user?.name || "Anonymous"}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {review.reviewDate
//                           ? new Date(review.reviewDate).toLocaleDateString()
//                           : ""}
//                       </span>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="mb-2">
//                       <span className="font-semibold">Title: </span>
//                       {review.reviewTitle || (
//                         <span className="text-muted-foreground">No title</span>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <span className="font-semibold">Rating: </span>
//                       {review.rating || (
//                         <span className="text-muted-foreground">No rating</span>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <span className="font-semibold">Positive: </span>
//                       {review.reviewPositiveText || (
//                         <span className="text-muted-foreground">
//                           No positive text
//                         </span>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <span className="font-semibold">Negative: </span>
//                       {review.reviewNegativeText || (
//                         <span className="text-muted-foreground">
//                           No negative text
//                         </span>
//                       )}
//                     </div>
//                     <div className="mb-2">
//                       <span className="font-semibold">Property Response: </span>
//                       {review.propertyResponse || (
//                         <span className="text-muted-foreground">
//                           No response
//                         </span>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//               <div className="flex justify-center gap-2 mt-6">
//                 <Button
//                   variant="outline"
//                   disabled={page === 1}
//                   onClick={() => setPage(page - 1)}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   disabled={!data?.data?.length || data.data.length < 10}
//                   onClick={() => setPage(page + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12 text-muted-foreground">
//               No reviews found.
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { useGetReviewsByHotelId } from "@/features/review/actions/use-get-review-by-hotel-id";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useState } from "react";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const { data: hotelData, isLoading: isLoadingHotel } = useGetMyHotel();
  const hotelId = hotelData?.id || hotelData?.hotel?.id; // support both possible shapes
  const { data, isLoading, isError, error } = useGetReviewsByHotelId({
    hotelId,
    page,
  });

  // Helper function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ☆
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-lg">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  // Helper function to get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-50 border-green-200";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (rating >= 2) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (isLoadingHotel) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                Hotel Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!hotelId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                Hotel Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">🏨</span>
                </div>
                <p className="text-gray-500 text-lg">No hotel found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-xl bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⭐</span>
              </div>
              Hotel Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-red-500">⚠️</span>
                </div>
                <p className="text-red-600 text-lg font-medium">
                  {error?.message || "Failed to load reviews."}
                </p>
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <div className="space-y-6">
                {data.data.map((review: any) => (
                  <Card
                    key={review.id}
                    className="rounded-xl bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {(review.user?.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {review.user?.name || "Anonymous"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {review.reviewDate
                                ? new Date(
                                    review.reviewDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : ""}
                            </p>
                          </div>
                        </div>
                        {review.rating && (
                          <div
                            className={`px-3 py-1 rounded-full border font-semibold text-sm ${getRatingColor(review.rating)}`}
                          >
                            {review.rating}/5
                          </div>
                        )}
                      </div>
                      {review.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {renderStarRating(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({review.rating}/5)
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      {review.reviewTitle && (
                        <div className="mb-4">
                          <h4 className="text-xl font-bold text-gray-800 leading-tight">
                            {review.reviewTitle}
                          </h4>
                        </div>
                      )}

                      <div className="space-y-4">
                        {review.reviewPositiveText && (
                          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-semibold text-sm flex-shrink-0">
                                👍 What they loved:
                              </span>
                              <p className="text-gray-700 leading-relaxed">
                                {review.reviewPositiveText}
                              </p>
                            </div>
                          </div>
                        )}

                        {review.reviewNegativeText && (
                          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-red-600 font-semibold text-sm flex-shrink-0">
                                👎 Areas for improvement:
                              </span>
                              <p className="text-gray-700 leading-relaxed">
                                {review.reviewNegativeText}
                              </p>
                            </div>
                          </div>
                        )}

                        {review.propertyResponse && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-600 font-semibold text-sm flex-shrink-0">
                                🏨 Hotel Response:
                              </span>
                              <p className="text-gray-700 leading-relaxed italic">
                                {review.propertyResponse}
                              </p>
                            </div>
                          </div>
                        )}

                        {!review.reviewPositiveText &&
                          !review.reviewNegativeText &&
                          !review.propertyResponse && (
                            <div className="text-center py-6 text-gray-400">
                              <span className="text-2xl">📝</span>
                              <p className="mt-2">
                                No detailed review text available
                              </p>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!data?.data?.length || data.data.length < 10}
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
