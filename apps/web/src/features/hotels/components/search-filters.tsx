"use client";

import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetHotelTypes } from "../queries/use-get-hotel-types";
import { useGetPropertyClasses } from "../queries/use-get-property-classes";
import { PriceRangeSlider } from "./price-range-slider";

interface SearchFiltersProps {
  currentSearch?: string;
  currentHotelType?: string;
  currentPropertyClass?: string;
  currentRoomTypes?: string;
  currentBrandName?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSort?: string;
  availableBrands?: string[];
  currentViewTypes?: string;
}

interface RoomType {
  id: string;
  name: string;
  hotelId: string;
  description?: string;
  price?: number;
  viewType?: string;
  bedConfiguration?: string;
}

export function SearchFilters({
  currentSearch = "",
  currentHotelType = "",
  currentPropertyClass = "",
  currentRoomTypes = "",
  currentBrandName = "",
  currentMinPrice = "",
  currentMaxPrice = "",
  currentSort = "desc",
  availableBrands = [],
  currentViewTypes = "",
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for form inputs
  const [search, setSearch] = useState(currentSearch);
  const [hotelType, setHotelType] = useState(currentHotelType);
  const [propertyClass, setPropertyClass] = useState(currentPropertyClass);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(
    currentRoomTypes ? currentRoomTypes.split(",").filter(Boolean) : []
  );
  const [brandName, setBrandName] = useState(currentBrandName);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [sort, setSort] = useState(currentSort);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [selectedViewTypes, setSelectedViewTypes] = useState<string[]>(
    currentViewTypes ? currentViewTypes.split(",").filter(Boolean) : []
  );

  // Fetch filter options
  const { data: hotelTypes, isPending: loadingHotelTypes } = useGetHotelTypes();
  const { data: propertyClasses, isPending: loadingPropertyClasses } =
    useGetPropertyClasses();

  // Fetch room types and calculate price range when component mounts
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRoomTypes(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/rooms/types?page=1&limit=1000&sort=desc`
        );

        if (response.ok) {
          const data = await response.json();
          // Get unique room types by name across all hotels
          const uniqueRoomTypes = data.data.reduce(
            (acc: RoomType[], roomType: RoomType) => {
              const exists = acc.find(
                (rt) => rt.name.toLowerCase() === roomType.name.toLowerCase()
              );
              if (!exists) {
                acc.push(roomType);
              }
              return acc;
            },
            []
          );

          setRoomTypes(
            uniqueRoomTypes.sort((a, b) => a.name.localeCompare(b.name))
          );

          // Calculate price range from all room types with prices
          const pricesWithValues = data.data
            .map((rt: RoomType) => rt.price)
            .filter((price: number | null) => price !== null && price > 0);

          if (pricesWithValues.length > 0) {
            const minPriceValue = Math.min(...pricesWithValues);
            const maxPriceValue = Math.max(...pricesWithValues);
            setPriceRange({
              min: Math.floor(minPriceValue),
              max: Math.ceil(maxPriceValue),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (hotelType) params.set("hotelType", hotelType);
    if (propertyClass) params.set("propertyClass", propertyClass);
    if (selectedRoomTypes.length > 0)
      params.set("roomTypes", selectedRoomTypes.join(","));
    if (brandName) params.set("brandName", brandName);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (selectedViewTypes.length > 0) {
      params.set("viewTypes", selectedViewTypes.join(","));
    }

    // Navigate to search page with filters
    router.push(`/search?${params.toString()}`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setHotelType("");
    setPropertyClass("");
    setSelectedRoomTypes([]);
    setBrandName("");
    setMinPrice("");
    setMaxPrice("");
    setSort("desc");
    setSelectedViewTypes([]);
    router.push("/search");
  };

  // Handle room type selection
  const handleRoomTypeChange = (roomTypeName: string, checked: boolean) => {
    let newRoomTypes: string[];

    if (checked) {
      newRoomTypes = [...selectedRoomTypes, roomTypeName];
    } else {
      newRoomTypes = selectedRoomTypes.filter((rt) => rt !== roomTypeName);
    }

    setSelectedRoomTypes(newRoomTypes);
  };

  // Track if any filter is active
  const hasActiveFilters =
    search ||
    hotelType ||
    propertyClass ||
    selectedRoomTypes.length > 0 ||
    brandName ||
    minPrice ||
    maxPrice ||
    sort !== "desc" ||
    selectedViewTypes.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#003580]" />
            Filter Results
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <X className="w-3 h-3 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Search input */}
          <div className="space-y-2">
            <Label
              htmlFor="search"
              className="text-sm font-medium text-gray-700"
            >
              Search Hotels
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Hotel name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#003580] focus:ring-[#003580]"
              />
            </div>
          </div>

          {/* Hotel type filter */}
          <div className="space-y-2">
            <Label
              htmlFor="hotelType"
              className="text-sm font-medium text-gray-700"
            >
              Hotel Type
            </Label>
            <Select value={hotelType} onValueChange={setHotelType}>
              <SelectTrigger
                id="hotelType"
                className="border-gray-200 focus:border-[#003580] focus:ring-[#003580]"
              >
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                {hotelTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property class filter */}
          <div className="space-y-2">
            <Label
              htmlFor="propertyClass"
              className="text-sm font-medium text-gray-700"
            >
              Property Class
            </Label>
            <Select value={propertyClass} onValueChange={setPropertyClass}>
              <SelectTrigger
                id="propertyClass"
                className="border-gray-200 focus:border-[#003580] focus:ring-[#003580]"
              >
                <SelectValue placeholder="Any class" />
              </SelectTrigger>
              <SelectContent>
                {propertyClasses?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Name Filter */}
          {availableBrands.length > 0 && (
            <div className="space-y-2">
              <Label
                htmlFor="brandName"
                className="text-sm font-medium text-gray-700"
              >
                Brand Name
              </Label>
              <Select value={brandName} onValueChange={setBrandName}>
                <SelectTrigger
                  id="brandName"
                  className="border-gray-200 focus:border-[#003580] focus:ring-[#003580]"
                >
                  <SelectValue placeholder="Any brand" />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-2">
            <PriceRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              defaultValue={[
                currentMinPrice ? parseFloat(currentMinPrice) : priceRange.min,
                currentMaxPrice ? parseFloat(currentMaxPrice) : priceRange.max,
              ]}
              onValueChange={([min, max]) => {
                setMinPrice(min.toString());
                setMaxPrice(max.toString());
              }}
            />
          </div>

          {/* Room Types Filter */}
          {roomTypes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Room Types
              </Label>
              <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {loadingRoomTypes ? (
                  <div className="text-sm text-gray-500">
                    Loading room types...
                  </div>
                ) : (
                  roomTypes.map((roomType) => (
                    <div
                      key={roomType.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`roomType-${roomType.id}`}
                        checked={selectedRoomTypes.includes(roomType.name)}
                        onCheckedChange={(checked) =>
                          handleRoomTypeChange(
                            roomType.name,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`roomType-${roomType.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        <div>
                          <div className="font-medium">{roomType.name}</div>
                          {roomType.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {roomType.description}
                            </div>
                          )}
                          {roomType.price && (
                            <div className="text-xs text-green-600">
                              From ${roomType.price}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
              {selectedRoomTypes.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  {selectedRoomTypes.length} room type(s) selected
                </div>
              )}
            </div>
          )}

          {/* View Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              View Types
            </Label>
            <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-md">
              {[
                { value: "ocean", icon: "🌊" },
                { value: "city", icon: "🏙️" },
                { value: "garden", icon: "🌸" },
                { value: "mountain", icon: "🗻" },
                { value: "pool", icon: "🏊" },
                { value: "courtyard", icon: "🏰" },
                { value: "street", icon: "🛣️" },
                { value: "interior", icon: "🏠" },
              ].map((viewType) => (
                <Button
                  key={viewType.value}
                  type="button"
                  variant={
                    selectedViewTypes.includes(viewType.value)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    const newViewTypes = selectedViewTypes.includes(
                      viewType.value
                    )
                      ? selectedViewTypes.filter((v) => v !== viewType.value)
                      : [...selectedViewTypes, viewType.value];
                    setSelectedViewTypes(newViewTypes);
                  }}
                  className={cn(
                    "flex items-center justify-start gap-2 px-3 py-2 text-sm w-full",
                    selectedViewTypes.includes(viewType.value)
                      ? "bg-[#003580] text-white hover:bg-[#002147]"
                      : "hover:border-[#003580] hover:text-[#003580]"
                  )}
                >
                  <span role="img" aria-label={viewType.value}>
                    {viewType.icon}
                  </span>
                  <span className="capitalize">
                    {viewType.value.replace(/_/g, " ")}
                  </span>
                </Button>
              ))}
            </div>
            {selectedViewTypes.length > 0 && (
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{selectedViewTypes.length} view type(s) selected</span>
                <button
                  type="button"
                  onClick={() => setSelectedViewTypes([])}
                  className="text-[#003580] hover:underline"
                >
                  Clear views
                </button>
              </div>
            )}
          </div>

          {/* Sort order */}
          <div className="space-y-2">
            <Label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort By
            </Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger
                id="sort"
                className="border-gray-200 focus:border-[#003580] focus:ring-[#003580]"
              >
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#003580] hover:bg-[#002147] text-white"
          >
            Apply Filters
          </Button>
        </form>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Active filters:</span>
              <div className="mt-2 space-y-1">
                {search && <div className="text-xs">Search: "{search}"</div>}
                {hotelType && hotelTypes && (
                  <div className="text-xs">
                    Type: {hotelTypes.find((t) => t.id === hotelType)?.name}
                  </div>
                )}
                {propertyClass && propertyClasses && (
                  <div className="text-xs">
                    Class:{" "}
                    {propertyClasses.find((p) => p.id === propertyClass)?.name}
                  </div>
                )}
                {brandName && <div className="text-xs">Brand: {brandName}</div>}
                {(minPrice || maxPrice) && (
                  <div className="text-xs">
                    Price: ${minPrice || priceRange.min} - $
                    {maxPrice || priceRange.max}
                  </div>
                )}
                {selectedRoomTypes.length > 0 && (
                  <div className="text-xs">
                    Room Types: {selectedRoomTypes.join(", ")}
                  </div>
                )}
                {selectedViewTypes.length > 0 && (
                  <div className="text-xs">
                    View Types:{" "}
                    {selectedViewTypes
                      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Types Component - Moved here */}
      {/* <ViewTypes
        selectedViews={selectedViewTypes}
        onChange={(views) => {
          setSelectedViewTypes(views);
          // Optionally auto-submit the form when views change
          const params = new URLSearchParams(searchParams.toString());
          if (views.length > 0) {
            params.set("viewTypes", views.join(","));
          } else {
            params.delete("viewTypes");
          }
          router.push(`/search?${params.toString()}`);
        }}
      /> */}
    </div>
  );
}
