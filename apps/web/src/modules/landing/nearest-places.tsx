"use client";

import { useRouter } from "next/navigation";
import { useGetDestinations } from "../../features/admin/property-type/actions/get-action";

export function NearestPlaces() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetDestinations({
    page: 1,
    limit: 20,
    search: "",
    sort: "desc",
  });

  const handleCardClick = () => {
    router.push("/search");
  };

  const handleShowAllClick = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-3 w-64"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-96"></div>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="h-12 bg-gray-200 rounded-2xl animate-pulse w-32 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return <div></div>;
  }

  const nearbyPlaces = data.data.filter(
    (item) => item.category === "Nearby Places"
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
            Explore nearby places
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-6">
            Discover amazing attractions and landmarks close to your location
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {nearbyPlaces.map((place, index) => (
            <div
              key={index}
              onClick={handleCardClick}
              className="bg-gradient-to-b from-white to-slate-50 rounded-3xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={place.featuredImage || "https://via.placeholder.com/300"}
                  alt={place.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {place.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {place.content || "No description available."}
                </p>
                <div className="flex items-center justify-between">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleShowAllClick}
            className="bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Show all places
          </button>
        </div>
      </div>
    </section>
  );
}
