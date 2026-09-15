import { HotelCard } from "@/features/hotels/components/hotel-card";
import { transformHotelsData } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import Link from "next/link";

type Props = {};

export async function FeaturedHotels({}: Props) {
  const rpcClient = await getClient();

  // Fetch hotels with limit=6 to show featured hotels
  const hotelsRes = await rpcClient.api.hotels.$get({
    query: {
      page: "1",
      limit: "6",
      sort: "desc",
    },
  });

  if (!hotelsRes.ok) {
    return <></>;
  }

  const apiResponse = await hotelsRes.json();

  // Transform date strings to Date objects
  // Also ensure that null values remain null and aren't converted to strings
  const transformedData = transformHotelsData(apiResponse.data);

  const hotelsData = {
    ...apiResponse,
    data: transformedData,
  };

  // Don't show if no hotels available
  if (hotelsData.data.length === 0) {
    return <></>;
  }

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Featured Places to Stay
        </h2>

        <p className="text-gray-600 text-sm md:text-base mb-6">
          Discover handpicked accommodations for your perfect getaway
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotelsData.data.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel as any} />
        ))}
      </div>

      {hotelsData.meta.totalCount > 6 && (
        <div className="max-w-5xl mx-auto mt-8 flex justify-center">
          <Link
            href="/hotels"
            className="px-6 py-3 bg-[#003580] hover:bg-[#00224f] transition-colors text-white rounded-md font-medium"
          >
            View All Properties
          </Link>
        </div>
      )}
    </div>
  );
}
