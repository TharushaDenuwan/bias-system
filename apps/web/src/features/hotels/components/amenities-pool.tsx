"use client";

import { amenitiesList, AmenitiesListItem } from "@/lib/helpers/amenities-map";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Dispatch, SetStateAction } from "react";

type Props = {
  selectedAmenities: AmenitiesListItem[];
  onSelect: Dispatch<SetStateAction<AmenitiesListItem[]>>;
};

export function AmenitiesPool({ selectedAmenities, onSelect }: Props) {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 shadow-inner border border-gray-200/50">
      <div className="flex items-center flex-wrap gap-4">
        {amenitiesList.map((item) => {
          const isActive =
            selectedAmenities.filter((selected) => selected.id === item.id)
              .length > 0;

          return (
            <Button
              key={item.id}
              onClick={() => {
                if (isActive) {
                  onSelect((prev) => prev.filter((i) => i.id !== item.id));
                } else {
                  onSelect((prev) => [...prev, item]);
                }
              }}
              icon={<item.icon />}
              className={cn(
                "rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md hover:border-gray-400"
              )}
              variant={isActive ? "default" : "outline"}
            >
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
