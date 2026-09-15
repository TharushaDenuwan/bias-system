"use client";

import { useEffect, useState } from "react";
import { useGetAds } from "../../features/admin/ad/actions/use-get-ad";

export function OffersSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, isError } = useGetAds({
    page: 1,
    limit: 10,
    search: "",
    sort: "desc",
  });

  // Always call hooks at the top level
  const activeOffers =
    data?.data?.filter((ad) => {
      // Handle different ways isActive might be stored
      return (
        ad.isActive === true || ad.isActive === "true" || ad.isActive === 1
      );
    }) || [];

  console.log("All ads:", data?.data);
  console.log("Active offers:", activeOffers);

  useEffect(() => {
    if (activeOffers.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeOffers.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeOffers.length]);

  if (isLoading) {
    return (
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-md w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-96 mx-auto mb-6"></div>
              <div className="h-80 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data || activeOffers.length === 0) {
    return (
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
              Special Offers
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              No active offers available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Special Offers
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Don't miss out on these amazing deals and exclusive savings
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {activeOffers.map((offer, index) => (
              <div key={offer.id || index} className="w-full flex-shrink-0">
                <div className="relative h-96 lg:h-80">
                  <img
                    src={
                      offer.imageUrl ||
                      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop"
                    }
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>

                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl mx-auto px-8 w-full">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-4">
                          {offer.placement && (
                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              {offer.placement}
                            </span>
                          )}
                          {offer.priority && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                              Priority {offer.priority}
                            </span>
                          )}
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                          {offer.title}
                        </h3>
                        {offer.description && (
                          <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                            {offer.description}
                          </p>
                        )}
                        {offer.redirectUrl && (
                          <a
                            href={offer.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                          >
                            Learn More
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {activeOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
