"use client";

import { useRouter } from "next/navigation";
import { useGetDestinations } from "../../features/admin/property-type/actions/get-action";

export function ExploreSriLanka() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetDestinations({
    page: 1,
    limit: 20,
    search: "",
    sort: "desc",
  });

  const handlePageClick = () => {
    router.push("/search");
  };

  const handleExploreAllClick = () => {
    router.push("/search");
  };
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-6"></div>
          </div>

          {/* Popular Destinations Shimmer */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-12 w-1/3 mx-auto"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browse by Region Shimmer */}
          <div className="max-w-5xl mx-auto">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-12 w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 bg-gray-200 rounded-3xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="h-12 bg-gray-200 rounded-2xl animate-pulse w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return <div></div>;
  }

  const popularDestinations = data.data.filter(
    (item) => item.category === "Popular Destinations"
  );
  const regions = data.data.filter((item) => item.category === "Region");

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
            Explore Sri Lanka
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-6">
            Discover the pearl of the Indian Ocean with its rich culture,
            stunning landscapes, and warm hospitality
          </p>
        </div>

        {/* Popular Destinations */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Popular Destinations
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-white to-slate-50 rounded-3xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      destination.featuredImage ||
                      "https://via.placeholder.com/300"
                    }
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {destination.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-3">
                    {destination.content || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Region */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-black mb-12 text-center">
            Browse by Region
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regions.map((region, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/60 to-blue-400/40 text-slate-900 cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  minHeight: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={
                      region.featuredImage || "https://via.placeholder.com/300"
                    }
                    alt={region.title}
                    className="w-full h-full object-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  className="relative p-4 flex flex-col justify-end"
                  style={{
                    background:
                      "linear-gradient(180deg, rgb(255 245 245 / 24%) 0%, rgb(20 40 100 / 96%) 100% 100%)",
                    zIndex: 1,
                  }}
                >
                  <h5 className="text-white text-2xl font-bold mb-2">
                    {region.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={handleExploreAllClick}
            className="bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Explore All Destinations
          </button>
        </div>
      </div>
    </section>
  );
}
