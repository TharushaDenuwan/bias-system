"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

import AddressAutoComplete, {
  AddressType,
} from "@/components/address-autocomplete";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import debounce from "lodash.debounce";
import { CheckCircle2, Edit3, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCreateHotel } from "../queries/use-create-hotel";
import {
  hotelInsertSchema,
  type HotelInsertType,
} from "../schemas/hotel.schema";
import { HotelTypesDropdown } from "./hotel-types-dropdown";
import { PropertyClassDropdown } from "./property-class-dropdown";

type Props = {
  className?: string;
};

// Now use that type for your default values
const defaultValues: Partial<HotelInsertType> = {
  name: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  starRating: 0,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  status: "pending_approval",
};

export function SetupHotel({ className }: Props) {
  const { mutate, isPending } = useCreateHotel();
  const router = useRouter();

  const [selectedHotelTypeID, setSelectedHotelTypeID] = useState<
    string | undefined
  >(undefined);
  const [selectedPropertyTypeID, setSelectedPropertyTypeID] = useState<
    string | undefined
  >(undefined);

  const [searchInput, setSearchInput] = useState("");
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [address, setAddress] = useState<AddressType>({
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

  const form = useAppForm({
    validators: { onChange: hotelInsertSchema },
    defaultValues,
    onSubmit: ({ value }) => {
      // Use address data or manual form data
      const addressData = isManualAddress
        ? {
            street: value.street,
            city: value.city,
            state: value.state,
            country: value.country,
            postalCode: value.postalCode,
            latitude: value.latitude ? value.latitude.toString() : null, // Convert to string
            longitude: value.longitude ? value.longitude.toString() : null, // Convert to string
          }
        : {
            street: address.address1,
            city: address.city,
            state: address.region,
            country: address.country,
            postalCode: address.postalCode,
            latitude: address.lat ? address.lat.toString() : null, // Convert to string
            longitude: address.lng ? address.lng.toString() : null, // Convert to string
          };

      mutate(
        {
          ...value,
          ...addressData,
          hotelType: selectedHotelTypeID,
          propertyClass: selectedPropertyTypeID,
        } as HotelInsertType,
        {
          onSuccess: () => {
            form.reset();
            router.push("/account/manage");
          },
        }
      );
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Card className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-heading">
          Setup your Property
        </CardTitle>
        <CardDescription>
          {`To get started, please fill out the details of your hotel. This will help us tailor the experience to your needs.`}
          <br />
          {`If you have any questions, feel free to reach out to our support team.`}
        </CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Hotel Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter hotel name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="brandName"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Brand Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter hotel brand name"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>

            <form.AppField
              name="description"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Description</field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Enter hotel description"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Address Section with Auto/Manual Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Hotel Address</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Auto Detect
                    </span>
                  </div>
                  <Switch
                    checked={isManualAddress}
                    onCheckedChange={setIsManualAddress}
                  />
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Manual Entry
                    </span>
                  </div>
                </div>
              </div>

              {!isManualAddress ? (
                <div className="">
                  <AddressAutoComplete
                    address={address}
                    setAddress={setAddress}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    dialogTitle="Enter Address"
                    placeholder="Search for your hotel address..."
                  />
                </div>
              ) : (
                <div className="grid gap-4">
                  <form.AppField
                    name="street"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Street Address</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Enter street address"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <form.AppField
                      name="city"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>City</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Enter city"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />

                    <form.AppField
                      name="state"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>State/Province</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Enter state/province"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <form.AppField
                      name="country"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Country</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Enter country"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />

                    <form.AppField
                      name="postalCode"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Postal Code</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="Enter postal code"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <form.AppField
                      name="latitude"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Latitude (Optional)</field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              type="number"
                              step="0.00000001"
                              placeholder="e.g., 40.7128"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />

                    <form.AppField
                      name="longitude"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Longitude (Optional)
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              type="number"
                              step="0.00000001"
                              placeholder="e.g., -74.0060"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <HotelTypesDropdown
                onSelect={(hotelType) => setSelectedHotelTypeID(hotelType?.id)}
              />
              <PropertyClassDropdown
                onSelect={(propertyClass) =>
                  setSelectedPropertyTypeID(propertyClass?.id)
                }
              />
            </div>
          </CardContent>

          <CardFooter className="mt-8 flex">
            {/* Example button for submission */}
            <Button
              icon={<CheckCircle2 />}
              loading={isPending}
              type="submit"
              className="w-full py-4"
            >
              Complete Setup
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}

function AddressAutoComplete({
  address,
  setAddress,
  searchInput,
  setSearchInput,
  dialogTitle,
  placeholder,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window.google === "undefined") {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA6cNFFMczGE2V0r0Sb_WUXsIb511s7AGI&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGoogleLoaded(true);
        script.onerror = () =>
          console.error("Failed to load Google Maps script");
        document.head.appendChild(script);
      } else {
        setIsGoogleLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded) return;

    const autocompleteService = new google.maps.places.AutocompleteService();

    const fetchSuggestions = debounce(async () => {
      if (searchInput.trim().length > 0) {
        autocompleteService.getPlacePredictions(
          {
            input: searchInput,
            types: ["address"],
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              setSuggestions(predictions || []);
            } else {
              console.error("Google Places API Error:", status);
              setSuggestions([]);
            }
          }
        );
      } else {
        setSuggestions([]);
      }
    }, 300);

    fetchSuggestions();

    return () => fetchSuggestions.cancel();
  }, [searchInput, isGoogleLoaded]);

  const handleSuggestionClick = (suggestion) => {
    const addressComponents = suggestion.structured_formatting;
    setAddress({
      address1: addressComponents.main_text || "",
      address2: "",
      formattedAddress: suggestion.description,
      city: addressComponents.secondary_text?.split(", ")[0] || "", // Extract city
      region: "", // Populate based on additional API call if needed
      postalCode: "", // Populate based on additional API call if needed
      country: addressComponents.secondary_text?.split(", ").slice(-1)[0] || "", // Extract country
      lat: 0, // Populate based on additional API call if needed
      lng: 0, // Populate based on additional API call if needed
    });
    setSearchInput(suggestion.description);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded p-2"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded mt-2 bg-white shadow-md">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutoComplete;
