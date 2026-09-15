"use client";

import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  BuildingIcon,
  ClockIcon,
  GlobeIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PlusCircleIcon,
  StarIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateRestaurant } from "../actions/use-create-restaurant";

const defaultValues = {
  name: "",
  description: "",
  brandName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  phone: "",
  email: "",
  website: "",
  starRating: "",
  checkInTime: "",
  checkOutTime: "",
  status: "active",
};

type Props = {
  onSuccess?: () => void;
};

export function CreateRestaurantDialog({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateRestaurant();
  const { data: hotelData } = useGetMyHotel();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    hotelId: "",
    createdBy: "",
    organizationId: "",
    ...defaultValues,
  });

  // Auto-fill IDs when hotel/session data is available
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      hotelId: hotelData?.id || "",
      createdBy: session?.user?.id || "",
      organizationId: session?.user?.organizationId || "",
      name: session?.user?.name || prev.name,
      email: session?.user?.email || prev.email,
    }));
  }, [hotelData, session]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      mutate(
        {
          ...form,
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
          starRating: form.starRating ? Number(form.starRating) : null,
          checkInTime: form.checkInTime || null,
          checkOutTime: form.checkOutTime || null,
          description: form.description || null,
          brandName: form.brandName || null,
          phone: form.phone || null,
          email: form.email || null,
          website: form.website || null,
        },
        {
          onSuccess: () => {
            toast.success("Restaurant created successfully");
            setForm({
              hotelId: "",
              createdBy: "",
              organizationId: "",
              ...defaultValues,
            });
            setOpen(false);
            if (onSuccess) onSuccess();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to create restaurant");
          },
        }
      );
    },
    [form, mutate, onSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          icon={<PlusCircleIcon className="w-4 h-4" />}
          type="button"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
        >
          Create New Restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <BuildingIcon className="w-6 h-6 text-blue-600" />
            Create New Restaurant
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Required IDs Section (hidden from user, auto-filled) */}
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <InfoIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Restaurant Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    disabled={isPending}
                    placeholder="Enter restaurant name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="brandName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Brand Name
                  </Label>
                  <Input
                    id="brandName"
                    value={form.brandName}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    disabled={isPending}
                    placeholder="Enter brand name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={isPending}
                  placeholder="Describe your restaurant..."
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Location Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="street"
                    className="text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </Label>
                  <Input
                    id="street"
                    value={form.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    disabled={isPending}
                    placeholder="123 Main Street"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    disabled={isPending}
                    placeholder="City name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700"
                  >
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    disabled={isPending}
                    placeholder="State or province"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    disabled={isPending}
                    placeholder="Country name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="postalCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    disabled={isPending}
                    placeholder="12345"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Coordinates (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      disabled={isPending}
                      placeholder="Latitude"
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Input
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(e) =>
                        handleChange("longitude", e.target.value)
                      }
                      disabled={isPending}
                      placeholder="Longitude"
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <PhoneIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <PhoneIcon className="w-3 h-3" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={isPending}
                    placeholder="+94 712 568 568 / +94 718 568 568"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <MailIcon className="w-3 h-3" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={isPending}
                    placeholder="restaurant@example.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <GlobeIcon className="w-3 h-3" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={isPending}
                    placeholder="https://restaurant.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Restaurant Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="starRating"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <StarIcon className="w-3 h-3" />
                    Star Rating
                  </Label>
                  <Input
                    id="starRating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={form.starRating}
                    onChange={(e) => handleChange("starRating", e.target.value)}
                    disabled={isPending}
                    placeholder="4.5"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="checkInTime"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <ClockIcon className="w-3 h-3" />
                    Check-in Time
                  </Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={form.checkInTime}
                    onChange={(e) =>
                      handleChange("checkInTime", e.target.value)
                    }
                    disabled={isPending}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="checkOutTime"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <ClockIcon className="w-3 h-3" />
                    Check-out Time
                  </Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={form.checkOutTime}
                    onChange={(e) =>
                      handleChange("checkOutTime", e.target.value)
                    }
                    disabled={isPending}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status
                  </Label>
                  <select
                    id="status"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    disabled={isPending}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">🔴 Inactive</option>
                    <option value="under_maintenance">
                      🟡 Under Maintenance
                    </option>
                    <option value="pending_approval">
                      🟠 Pending Approval
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={isPending}
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {isPending ? "Creating..." : "Create Restaurant"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
