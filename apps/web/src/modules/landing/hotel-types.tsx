import { transformDatesRecursive } from "@/features/hotels/utils/transforms";
import { getClient } from "@/lib/rpc/server";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@repo/ui/components/carousel";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

type Props = {};

export async function HotelTypes({}: Props) {
  const rpcClient = await getClient();

  const hotelTypesRes = await rpcClient.api.hotels.types.$get({
    query: {
      page: "1",
      limit: "10"
    }
  });

  if (!hotelTypesRes.ok) {
    return <></>;
  }

  const apiResponse = await hotelTypesRes.json();
  // Use the more specific transformation for consistent Date handling
  const hotelTypesData = transformDatesRecursive(apiResponse);

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Discover Unique Accommodations
        </h2>

        <p className="text-gray-600 text-sm md:text-base mb-6">
          Explore a variety of hotel types, from luxurious resorts to cozy
          boutique hotels, all tailored to your unique preferences.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {hotelTypesData.map((hotelType: { id: any; thumbnail: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/3 lg:basis-1/5"
              >
                <Link href={`/search?hotelType=${hotelType.id}`}>
                  <div className="group relative h-36 md:h-48 w-full overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

                    <Image
                      src={hotelType.thumbnail || ""}
                      width={600}
                      height={400}
                      alt={`${hotelType.name} accommodations`}
                      className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                      <h3 className="text-white font-medium text-lg">
                        {hotelType.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-none shadow-md" />
          <CarouselNext className="right-2 bg-white/80 hover:bg-white border-none shadow-md" />
        </Carousel>
      </div>
    </div>
  );
}
