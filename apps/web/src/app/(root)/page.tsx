// import { Articles } from "@/modules/landing/articles";
// import { FeaturedHotels } from "@/modules/landing/featured-hotels";
// import { HotelImageGallery } from "@/modules/landing/gallery";
// import { Hero } from "@/modules/landing/hero";
// import { FeaturedRestaurants } from "@/modules/landing/restaurants";
// import { Suspense } from "react";

// export default async function Home() {
//   return (
//     <div className="w-full min-h-screen">
//       <Hero />

//       {/* <Suspense fallback={<div>Loading hotel types...</div>}>
//         <HotelTypes />
//       </Suspense> */}

//       <Suspense fallback={<div>Loading featured hotels...</div>}>
//         <FeaturedHotels />
//       </Suspense>

//       <Suspense fallback={<div>Hottest destinations...</div>}>
//         <HotelImageGallery />
//       </Suspense>

//       <Suspense fallback={<div>Loading featured restaurants...</div>}>
//         <FeaturedRestaurants />
//       </Suspense>

//       <Suspense fallback={<div>Loading articles...</div>}>
//         <Articles />
//       </Suspense>

//       {/* <Suspense fallback={<div>Loading property classes...</div>}>
//         <PropertyClasses />
//       </Suspense> */}
//     </div>
//   );
// }

import { Articles } from "@/modules/landing/articles";
import { FeaturedHotels } from "@/modules/landing/featured-hotels";
import { Hero } from "@/modules/landing/hero";
import { FeaturedRestaurants } from "@/modules/landing/restaurants";
import { Suspense } from "react";

// New Static Components
import { DownloadApp } from "@/modules/landing/download-app";
import { ExploreSriLanka } from "@/modules/landing/explore-sri-lanka";
import { ListYourProperty } from "@/modules/landing/list-property";
import { NearestPlaces } from "@/modules/landing/nearest-places";
import { OffersSection } from "@/modules/landing/offers";
import { PropertyTypes } from "@/modules/landing/property-types";

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />

      {/* Offers Section */}
      <OffersSection />

      <Suspense
        fallback={
          <div className="flex justify-center py-12 text-slate-600">
            Loading featured hotels...
          </div>
        }
      >
        <FeaturedHotels />
      </Suspense>

      {/* Browse by Property Type */}
      <PropertyTypes />

      {/* <Suspense
        fallback={
          <div className="flex justify-center py-12 text-slate-600">
            Loading hottest destinations...
          </div>
        }
      >
        <HotelImageGallery />
      </Suspense> */}

      {/* Explore Sri Lanka Section */}
      <ExploreSriLanka />

      <Suspense
        fallback={
          <div className="flex justify-center py-12 text-slate-600">
            Loading featured restaurants...
          </div>
        }
      >
        <FeaturedRestaurants />
      </Suspense>

      {/* Nearest Places */}
      <NearestPlaces />

      {/* List Your Property */}
      <ListYourProperty />

      <Suspense
        fallback={
          <div className="flex justify-center py-12 text-slate-600">
            Loading articles...
          </div>
        }
      >
        <Articles />
      </Suspense>

      {/* Download App */}
      <DownloadApp />

      {/* Newsletter Subscription */}
      {/* <Newsletter /> */}
    </div>
  );
}
