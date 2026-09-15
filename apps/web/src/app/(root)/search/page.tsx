import { NoResults } from "@/features/hotels/components/no-results";
import { SearchFilters } from "@/features/hotels/components/search-filters";
import { Pagination } from "@/features/hotels/components/search-pagination";
import { SearchResults } from "@/features/hotels/components/search-results";
import { transformHotelsData } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import { Suspense } from "react";

// Update SearchParams type
type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  hotelType?: string;
  propertyClass?: string;
  roomTypes?: string; // comma-separated room type names
  brandName?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "asc" | "desc";
  viewTypes?: string;
};

export const metadata = {
  title: "Search Hotels | Bloonsoo",
  description:
    "Find your perfect accommodation from our extensive collection of hotels.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Extract search parameters with defaults
  const {
    page = "1",
    limit = "9",
    search = "",
    hotelType = "",
    propertyClass = "",
    roomTypes = "",
    brandName = "",
    minPrice = "",
    maxPrice = "",
    sort = "desc",
    viewTypes = "",
  } = await searchParams;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const minPriceNum = minPrice ? parseFloat(minPrice) : null;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null;

  // Fetch hotels and filter data
  const rpcClient = await getClient();

  try {
    const [hotelsRes, hotelTypesRes, propertyClassesRes] = await Promise.all([
      rpcClient.api.hotels.$get({
        query: {
          page,
          limit,
          search,
          hotelType,
          propertyClass,
          sort,
        },
      }),
      rpcClient.api.hotels.types.$get({
        query: { page: "1", limit: "50" },
      }),
      rpcClient.api["property-classes"].$get({
        query: { page: "1", limit: "50" },
      }),
    ]);

    // Return empty state if main API call fails
    if (!hotelsRes.ok) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <h1 className="text-2xl font-bold mb-4 text-gray-900">
                Search Hotels
              </h1>
              <p className="text-gray-600">
                Something went wrong while fetching hotels. Please try again.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const apiResponse = await hotelsRes.json();
    const hotelTypes = hotelTypesRes.ok ? await hotelTypesRes.json() : [];
    const propertyClasses = propertyClassesRes.ok
      ? await propertyClassesRes.json()
      : [];

    // Transform date strings to Date objects
    const transformedData = transformHotelsData(apiResponse.data);

    // Get unique brand names from hotels data
    const uniqueBrands = Array.from(
      new Set(
        transformedData.map((hotel: any) => hotel.brandName).filter(Boolean)
      )
    ).sort();

    let filteredHotels = transformedData;

    // Filter by brand name if specified
    if (brandName) {
      filteredHotels = filteredHotels.filter(
        (hotel: any) =>
          hotel.brandName &&
          hotel.brandName.toLowerCase() === brandName.toLowerCase()
      );
    }

    // Filter by room types and price if specified
    if (
      roomTypes ||
      minPriceNum !== null ||
      maxPriceNum !== null ||
      viewTypes
    ) {
      const selectedRoomTypes = roomTypes
        ? roomTypes.split(",").filter(Boolean)
        : [];
      const selectedViewTypes = viewTypes
        ? viewTypes.split(",").filter(Boolean)
        : [];

      // Fetch room types for each hotel and filter
      const hotelsWithRoomTypes = await Promise.all(
        filteredHotels.map(async (hotel: any) => {
          try {
            const roomTypesRes = await fetch(
              `http://localhost:8000/api/hotels/${hotel.id}/room-types?page=1&limit=100`
            );

            if (roomTypesRes.ok) {
              const roomTypesData = await roomTypesRes.json();
              const hotelRoomTypes = roomTypesData.data;

              // Check room type filter
              let hasSelectedRoomType = true;
              if (selectedRoomTypes.length > 0) {
                hasSelectedRoomType = selectedRoomTypes.some((roomType) =>
                  hotelRoomTypes.some((hotelRoomType: any) =>
                    hotelRoomType.name
                      .toLowerCase()
                      .includes(roomType.toLowerCase())
                  )
                );
              }

              // Check price filter
              let hasRoomInPriceRange = true;
              if (minPriceNum !== null || maxPriceNum !== null) {
                hasRoomInPriceRange = hotelRoomTypes.some((roomType: any) => {
                  if (!roomType.price) return false;

                  const price = parseFloat(roomType.price);
                  const minCheck = minPriceNum === null || price >= minPriceNum;
                  const maxCheck = maxPriceNum === null || price <= maxPriceNum;

                  return minCheck && maxCheck;
                });
              }

              // Check view type filter
              let hasSelectedViewType = true;
              if (selectedViewTypes.length > 0) {
                hasSelectedViewType = hotelRoomTypes.some((roomType: any) =>
                  selectedViewTypes.includes(roomType.viewType)
                );
              }

              // Hotel must satisfy all conditions
              return hasSelectedRoomType &&
                hasRoomInPriceRange &&
                hasSelectedViewType
                ? hotel
                : null;
            }
            return null;
          } catch (error) {
            console.error(
              `Error fetching room types for hotel ${hotel.id}:`,
              error
            );
            return null;
          }
        })
      );

      filteredHotels = hotelsWithRoomTypes.filter(Boolean);
    }

    const hotels = {
      ...apiResponse,
      data: filteredHotels,
      meta: {
        ...apiResponse.meta,
        totalCount: filteredHotels.length,
        totalPages: Math.ceil(filteredHotels.length / limitNumber),
      },
    };

    // Calculate pagination values
    const totalCount = filteredHotels.length;
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Apply pagination to filtered results
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedHotels = {
      ...hotels,
      data: filteredHotels.slice(startIndex, endIndex),
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#003580]">
              Find Your Perfect Stay
            </h1>
            <p className="text-gray-600 mt-2">
              Discover amazing accommodations tailored to your preferences
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Suspense
                fallback={
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                }
              >
                <SearchFilters
                  currentHotelType={hotelType}
                  currentPropertyClass={propertyClass}
                  currentRoomTypes={roomTypes}
                  currentBrandName={brandName}
                  currentMinPrice={minPrice}
                  currentMaxPrice={maxPrice}
                  currentSort={sort}
                  currentSearch={search}
                  availableBrands={uniqueBrands}
                  currentViewTypes={viewTypes}
                />
              </Suspense>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {totalCount} {totalCount === 1 ? "result" : "results"}{" "}
                      found
                    </h2>
                    {(search ||
                      hotelType ||
                      propertyClass ||
                      roomTypes ||
                      brandName ||
                      minPrice ||
                      maxPrice) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {search && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#003580]/10 text-[#003580]">
                            Search: "{search}"
                          </span>
                        )}
                        {hotelType &&
                          hotelTypes?.find((t) => t.id === hotelType) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {hotelTypes.find((t) => t.id === hotelType)?.name}
                            </span>
                          )}
                        {propertyClass &&
                          propertyClasses?.find(
                            (p) => p.id === propertyClass
                          ) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {
                                propertyClasses.find(
                                  (p) => p.id === propertyClass
                                )?.name
                              }
                            </span>
                          )}
                        {brandName && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Brand: {brandName}
                          </span>
                        )}
                        {(minPrice || maxPrice) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Price: ${minPrice || "0"} - ${maxPrice || "∞"}
                          </span>
                        )}
                        {roomTypes && (
                          <div className="flex flex-wrap gap-1">
                            {roomTypes
                              .split(",")
                              .filter(Boolean)
                              .map((roomType) => (
                                <span
                                  key={roomType}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                >
                                  {roomType}
                                </span>
                              ))}
                          </div>
                        )}
                        {viewTypes && (
                          <div className="flex flex-wrap gap-1">
                            {viewTypes
                              .split(",")
                              .filter(Boolean)
                              .map((viewType) => (
                                <span
                                  key={viewType}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {viewType.charAt(0).toUpperCase() +
                                    viewType.slice(1)}{" "}
                                  View
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {pageNumber} of {totalPages}
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              {paginatedHotels.data.length > 0 ? (
                <div className="space-y-6">
                  <SearchResults hotels={paginatedHotels.data as any} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                      <Pagination
                        currentPage={pageNumber}
                        totalPages={totalPages}
                        baseUrl="/search"
                        searchParams={searchParams}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <NoResults searchTerm={search} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in search page:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              Search Hotels
            </h1>
            <p className="text-gray-600">
              Something went wrong while loading the search page. Please try
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
