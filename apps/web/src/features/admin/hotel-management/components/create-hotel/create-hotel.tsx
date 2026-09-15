"use client";

import AddressAutoComplete, {
  AddressType
} from "@/components/address-autocomplete";
import { HotelTypesDropdown } from "@/features/hotels/components/hotel-types-dropdown";
import { PropertyClassDropdown } from "@/features/hotels/components/property-class-dropdown";
import { useCreateHotelByAdmin } from "@/features/hotels/queries/use-create-hotel-by-admin";
import {
  hotelInsertSchema,
  type HotelInsertByAdminType
} from "@/features/hotels/schemas/hotel.schema";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useCreateHotelStore } from "./store";

// Now use that type for your default values
let defaultValues: Partial<HotelInsertByAdminType> = {
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
  organizationId: "",
  createdBy: ""
};

export function CreateHotel() {
  const router = useRouter();
  const { userId, organizationId } = useCreateHotelStore();

  const { mutate, isPending } = useCreateHotelByAdmin();

  const [selectedHotelTypeID, setSelectedHotelTypeID] = useState<
    string | undefined
  >(undefined);
  const [selectedPropertyTypeID, setSelectedPropertyTypeID] = useState<
    string | undefined
  >(undefined);

  const [searchInput, setSearchInput] = useState("");
  const [address, setAddress] = useState<AddressType>({
    address1: "",
    address2: "",
    formattedAddress: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    lat: 0,
    lng: 0
  });

  const form = useAppForm({
    validators: { onChange: hotelInsertSchema },
    defaultValues,
    onSubmit: ({ value }) =>
      mutate(
        {
          ...value,
          hotelType: selectedHotelTypeID,
          propertyClass: selectedPropertyTypeID,
          organizationId: organizationId!,
          createdBy: userId!
        } as HotelInsertByAdminType,
        {
          onSuccess: () => {
            form.reset();
            router.push("/admin/hotels");
          }
        }
      )
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
    <Card className="w-full max-w-2xl rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading">
          Setup Hotel Details
        </CardTitle>
        <CardDescription>Provide the details of the hotel</CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-y-5 mb-6">
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

            <div className="">
              <AddressAutoComplete
                address={address}
                setAddress={setAddress}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                dialogTitle="Enter Address"
              />
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

          <CardFooter>
            <Button type="submit" loading={isPending} disabled={isPending}>
              Complete Hotel Setup
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
