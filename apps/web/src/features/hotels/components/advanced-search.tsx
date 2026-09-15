"use client";

import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { format } from "date-fns";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import AddressAutoComplete from "./setup-hotel"; // Import AddressAutoComplete

// Add global declaration for google namespace
declare global {
  namespace google {
    namespace maps {
      namespace places {
        interface AutocompletePrediction {
          description: string;
          place_id: string;
        }
        class AutocompleteService {
          getPlacePredictions(
            request: {
              input: string;
              types?: string[];
              fields?: string[];
            },
            callback: (
              predictions: AutocompletePrediction[] | null,
              status: string
            ) => void
          ): void;
        }
        enum PlacesServiceStatus {
          OK = "OK",
        }
      }
    }
  }
}

const SearchComponent = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    formattedAddress: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    lat: 0,
    lng: 0,
  });

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current =
          new google.maps.places.AutocompleteService();
        setIsGoogleMapsLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA6cNFFMczGE2V0r0Sb_WUXsIb511s7AGI&libraries=places";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current =
            new google.maps.places.AutocompleteService();
          setIsGoogleMapsLoaded(true);
        }
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);

    if (
      value &&
      value.length > 2 &&
      autocompleteService.current &&
      isGoogleMapsLoaded
    ) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ["(cities)", "establishment"],
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    setDestination(suggestion.description);
    setSuggestions([]);
    setIsDestinationFocused(false);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    // Auto-close logic: close check-in if both dates are selected or if we're selecting check-out
    if (isCheckInOpen && range?.from && range?.to) {
      setIsCheckInOpen(false);
    }

    // Auto-close check-out if both dates are selected
    if (isCheckOutOpen && range?.from && range?.to) {
      setIsCheckOutOpen(false);
    }

    // Auto-open check-out when check-in is selected but check-out is not
    if (isCheckInOpen && range?.from && !range?.to) {
      setIsCheckInOpen(false);
      setTimeout(() => setIsCheckOutOpen(true), 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      inputRef.current?.focus();
      return;
    }

    const query = new URLSearchParams({
      destination,
      checkIn: dateRange?.from ? dateRange.from.toISOString() : "",
      checkOut: dateRange?.to ? dateRange.to.toISOString() : "",
      guests: guests.toString(),
      rooms: rooms.toString(),
    }).toString();
    router.push(`/search?${query}`);
  };

  const formatGuestText = () => {
    if (guests === 1 && rooms === 1) {
      return "1 guest, 1 room";
    }
    return `${guests} guest${guests > 1 ? "s" : ""}, ${rooms} room${rooms > 1 ? "s" : ""}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl mx-auto -mt-16 relative z-10">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row">
        {/* Destination Input with AddressAutoComplete */}
        <div
          className={cn(
            "relative transition-all duration-300 ease-in-out border-r border-gray-200",
            isDestinationFocused || destination
              ? "flex-1 lg:flex-[2]"
              : "flex-1"
          )}
        >
          <div className="p-4 pb-2">
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              Destination
            </label>
            <Dialog>
              <div>
                <DialogTrigger asChild>
                  <div className="w-full p-3 rounded-lg border cursor-pointer">
                    <input
                      ref={inputRef}
                      readOnly
                      value={address.formattedAddress || destination}
                      placeholder="Search destinations"
                      className="w-full bg-transparent outline-none text-sm"
                      onClick={() => setIsDestinationFocused(true)}
                    />
                  </div>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Search destination</DialogTitle>
                  </DialogHeader>

                  <div className="p-2">
                    <AddressAutoComplete
                      address={address}
                      setAddress={setAddress}
                      searchInput={destination}
                      setSearchInput={setDestination}
                      dialogTitle="Enter Destination"
                      placeholder="Search destinations"
                    />
                  </div>
                </DialogContent>
              </div>
            </Dialog>
          </div>
        </div>

        {/* Check-in Date */}
        <div className="border-r border-gray-200 lg:flex-1">
          <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <PopoverTrigger asChild>
              <div className="p-4 pb-2 cursor-pointer hover:bg-gray-50 transition-colors w-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Check-in
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {dateRange?.from
                      ? format(dateRange.from, "MMM dd")
                      : "Add dates"}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                initialFocus
                disabled={(date: Date) => date < today}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="border-r border-gray-200 lg:flex-1">
          <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
            <PopoverTrigger asChild>
              <div className="p-4 pb-2 cursor-pointer hover:bg-gray-50 transition-colors w-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Check-out
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {dateRange?.to
                      ? format(dateRange.to, "MMM dd")
                      : "Add dates"}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                initialFocus
                disabled={(date: number) => {
                  const d = new Date(date);
                  if (d < today) return true;
                  if (dateRange?.from && d <= dateRange.from) return true;
                  return false;
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Room & Guest Selector */}
        <div className="lg:flex-1">
          <Popover open={isGuestPickerOpen} onOpenChange={setIsGuestPickerOpen}>
            <PopoverTrigger asChild>
              <div className="p-4 pb-2 cursor-pointer hover:bg-gray-50 transition-colors h-full w-full">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Room & Guest
                </label>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatGuestText()}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Guests</div>
                      <div className="text-sm text-gray-500">
                        Ages 13 or above
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {guests}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Rooms</div>
                      <div className="text-sm text-gray-500">
                        How many rooms do you need?
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        disabled={rooms <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {rooms}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                        onClick={() => setRooms(Math.min(10, rooms + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="p-4 lg:p-2 lg:flex items-center">
          <Button
            type="submit"
            className="w-full lg:w-auto h-12 lg:h-12 px-8 rounded-full text-sm font-semibold bg-blue-900 hover:bg-blue-950 transition-colors shadow-lg hover:shadow-xl"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
