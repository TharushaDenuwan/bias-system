import { getClient } from "@/lib/rpc/server";
import Link from "next/link";

type Restaurant = {
  id: string;
  hotelId: string;
  name: string;
  description?: string | null;
  brandName?: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  starRating?: number | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
};

type RestaurantImage = {
  id: string;
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
};

type Props = {};

export async function FeaturedRestaurants({}: Props) {
  const rpcClient = await getClient();

  // Fetch restaurants with limit=6 to show featured restaurants
  const restaurantsRes = await rpcClient.api.restaurant.$get({
    query: {
      page: "1",
      limit: "6",
      sort: "desc",
      status: "available",
    },
  });

  if (!restaurantsRes.ok) {
    return <></>;
  }

  const apiResponse = await restaurantsRes.json();
  const restaurants: Restaurant[] = apiResponse.data;

  if (!restaurants || restaurants.length === 0) {
    return <></>;
  }

  // Fetch images for each restaurant
  const imagesMap: Record<string, RestaurantImage[]> = {};
  await Promise.all(
    restaurants.map(async (restaurant) => {
      const imagesRes = await rpcClient.api.restaurant[
        restaurant.id
      ].images.$get({
        query: {
          page: "",
          limit: "",
          sort: "desc",
          search: "",
        },
      });
      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        imagesMap[restaurant.id] = imagesData.data;
      } else {
        imagesMap[restaurant.id] = [];
      }
    })
  );

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Featured Restaurants
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Discover handpicked restaurants for your next meal
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => {
          const images = imagesMap[restaurant.id] || [];
          const thumbnail = images.find((img) => img.isThumbnail) || images[0];

          return (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              {thumbnail && (
                <div className="mb-2 w-full aspect-video rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={thumbnail.imageUrl}
                    alt={thumbnail.altText || restaurant.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#003580]">
                {restaurant.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {restaurant.description || "No description available."}
              </p>
              <div className="text-xs text-gray-500">
                {restaurant.city}, {restaurant.state}, {restaurant.country}
              </div>
              {restaurant.website && (
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs"
                >
                  Visit Website
                </a>
              )}
            </Link>
          );
        })}
      </div>

      {apiResponse.meta.totalCount > 6 && (
        <div className="max-w-5xl mx-auto mt-8 flex justify-center">
          <Link
            href="/restaurants"
            className="px-6 py-3 bg-[#003580] hover:bg-[#00224f] transition-colors text-white rounded-md font-medium"
          >
            View All Restaurants
          </Link>
        </div>
      )}
    </div>
  );
}
