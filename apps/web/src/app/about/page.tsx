import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import { Landmark, Mountain, Plane, TreePalm } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full text-white">
      <Navbar />
      {/* Hero Section with Background Image */}
      <div className="relative w-full min-h-[40vh] flex items-center justify-center text-center px-4 py-12 md:py-20 mb-10 animate-fade-in-up">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/about-bg.jpg"
            alt="About Background"
            layout="fill"
            objectFit="cover"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in-up">
            About Bloonsoo
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white animate-fade-in-up delay-100">
            Where your travel experience becomes easier and more enjoyable.
          </p>
        </div>
      </div>

      {/* Glass Card Section - Floating on image */}
      <div className="px-4 -mt-20 mb-12 flex justify-center">
        <div className="max-w-230 bg-white backdrop-blur-md p-8 rounded-2xl shadow-2xl text-left animate-fade-in-up delay-200">
          <p className="text-base leading-relaxed text-gray-800 text-center">
            <span className="block text-lg font-semibold text-blue-800">
              Sri Lanka is a stunning island paradise, blending ancient heritage
              with breathtaking natural beauty
            </span>
            and modern charm, offering unparalleled natural beauty, rich
            culture, and unforgettable experiences, all made easier with
            Bloonsoo. Take the opportunity to explore its rich history at iconic
            sites like Sigiriya and the ancient cities of Anuradhapura and
            Polonnaruwa. Experience its vibrant culture by visiting landmarks
            such as the Temple of the Tooth in Kandy, the colonial charm of
            Galle Fort, and the bustling streets of Colombo. With Bloonsoo, plan
            your journey seamlessly—whether you're exploring ancient temples,
            relaxing in luxury resorts, or embarking on thrilling wildlife
            safaris.
          </p>
        </div>
      </div>

      {/* Why Visit Sri Lanka Section */}
      <div className="mt-24 px-4 w-full max-w-6xl mb-20 mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-2 gap-10 text-left">
          {/* Best Hotel Deals */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-yellow-300" /> Best Hotel Deals
            </h3>
            <p className="text-sm text-gray-800">
              We partner with top-rated hotels and resorts to bring you
              exclusive discounts you won’t find anywhere else. Enjoy luxury
              stays at unbeatable prices — every time you travel.
            </p>
          </div>

          {/* 24/7 Travel Support */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Plane className="w-6 h-6 text-sky-300" /> 24/7 Travel Support
            </h3>
            <p className="text-sm text-gray-800">
              Need help planning, booking, or managing a trip? Our support team
              is available 24/7 — from takeoff to touchdown, so you can relax
              and enjoy the journey.
            </p>
          </div>

          {/* Seamless Booking Experience */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Mountain className="w-6 h-6 text-red-300" /> Seamless Booking
            </h3>
            <p className="text-sm text-gray-800">
              Book hotels, discover travel deals, and plan getaways — all in one
              place. Bloonsoo’s smooth interface ensures a frictionless booking
              experience from start to finish.
            </p>
          </div>

          {/* Trusted by Thousands */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <TreePalm className="w-6 h-6 text-green-300" /> Trusted by
              Thousands
            </h3>
            <p className="text-sm text-gray-800">
              Thousands of happy travelers trust Bloonsoo to help them plan
              unforgettable trips. With real reviews, verified listings, and
              secure payments — you’re in good hands.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
