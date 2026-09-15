"use client";

import { useRouter } from "next/navigation";

export function ListYourProperty() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/search");
  };

  const handleListPropertyClick = () => {
    router.push("/search");
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            List your property
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of hosts earning extra income by listing their
            properties with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="text-center cursor-pointer" onClick={handleCardClick}>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Earn Extra Income
            </h3>
            <p className="text-blue-200">
              Turn your property into a profitable investment with competitive
              rates
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center cursor-pointer" onClick={handleCardClick}>
            <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-xl font-semibold text-white mb-4">
              Easy Management
            </h3>
            <p className="text-blue-200">
              Simple dashboard to manage bookings, pricing, and guest
              communication
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center cursor-pointer" onClick={handleCardClick}>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              24/7 Support
            </h3>
            <p className="text-blue-200">
              Get help whenever you need it with our dedicated host support team
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleListPropertyClick}
            className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            List Your Property Now
          </button>
        </div>
      </div>
    </section>
  );
}
