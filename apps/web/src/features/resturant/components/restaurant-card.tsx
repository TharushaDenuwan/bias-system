// "use client";

// import { Badge } from "@repo/ui/components/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { formatDistanceToNow } from "date-fns";
// import type { Restaurant } from "../schemas";

// type Props = {
//   restaurant: Restaurant;
// };

// export function RestaurantCard({ restaurant }: Props) {
//   return (
//     <Card className="transition-all hover:shadow-lg border-l-4 border-l-cyan-500 p-4 w-full max-w-full mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl">{restaurant.name}</CardTitle>
//         <div className="flex items-center gap-2 mt-2">
//           <Badge
//             variant="outline"
//             className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
//           >
//             {restaurant.status}
//           </Badge>
//           <span className="text-xs text-muted-foreground">
//             Added {formatDistanceToNow(new Date(restaurant.createdAt))} ago
//           </span>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <div>
//           <span className="font-semibold">ID:</span>
//           <p>{restaurant.id}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Hotel ID:</span>
//           <p>{restaurant.hotelId}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Created By:</span>
//           <p>{restaurant.createdBy}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Organization ID:</span>
//           <p>{restaurant.organizationId}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Name:</span>
//           <p>{restaurant.name}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Description:</span>
//           <p className="text-muted-foreground">
//             {restaurant.description ?? "—"}
//           </p>
//         </div>
//         <div>
//           <span className="font-semibold">Brand Name:</span>
//           <p>{restaurant.brandName ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Street:</span>
//           <p>{restaurant.street}</p>
//         </div>
//         <div>
//           <span className="font-semibold">City:</span>
//           <p>{restaurant.city}</p>
//         </div>
//         <div>
//           <span className="font-semibold">State:</span>
//           <p>{restaurant.state}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Country:</span>
//           <p>{restaurant.country}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Postal Code:</span>
//           <p>{restaurant.postalCode}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Latitude:</span>
//           <p>{restaurant.latitude ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Longitude:</span>
//           <p>{restaurant.longitude ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Phone:</span>
//           <p>{restaurant.phone ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Email:</span>
//           <p>{restaurant.email ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Website:</span>
//           <p>{restaurant.website ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Star Rating:</span>
//           <p>{restaurant.starRating ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Check In Time:</span>
//           <p>{restaurant.checkInTime ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Check Out Time:</span>
//           <p>{restaurant.checkOutTime ?? "—"}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Status:</span>
//           <p>{restaurant.status}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Created At:</span>
//           <p>{restaurant.createdAt}</p>
//         </div>
//         <div>
//           <span className="font-semibold">Updated At:</span>
//           <p>{restaurant.updatedAt ?? "—"}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { formatDistanceToNow } from "date-fns";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  HashIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useUpdateRestaurant } from "../actions/use-update-restaurant";
import type { Restaurant } from "../schemas";

type Props = {
  restaurant: Restaurant;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
      return "bg-gray-200 text-gray-600 border-gray-300";
    case "under_maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_approval":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case "active":
      return "⚪";
    case "inactive":
      return "⚫";
    case "under_maintenance":
      return "🔘";
    case "pending_approval":
      return "◐";
    default:
      return "○";
  }
};

const formatStarRating = (rating: number | null) => {
  if (!rating) return "—";
  const stars = "★".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.floor(rating));
  return `${stars}${emptyStars} ${rating}`;
};

export function RestaurantCard({ restaurant }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description ?? "",
    brandName: restaurant.brandName ?? "",
    street: restaurant.street,
    city: restaurant.city,
    state: restaurant.state,
    country: restaurant.country,
    postalCode: restaurant.postalCode,
    latitude: restaurant.latitude ?? "",
    longitude: restaurant.longitude ?? "",
    phone: restaurant.phone ?? "",
    email: restaurant.email ?? "",
    website: restaurant.website ?? "",
    starRating: restaurant.starRating ?? "",
    checkInTime: restaurant.checkInTime ?? "",
    checkOutTime: restaurant.checkOutTime ?? "",
    status: restaurant.status,
  });

  const { mutate, isPending } = useUpdateRestaurant();

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        id: restaurant.id,
        data: {
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
      },
      {
        onSuccess: () => {
          toast.success("Restaurant updated successfully");
          setEditOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update restaurant");
        },
      }
    );
  };

  return (
    <Card className="relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 overflow-hidden bg-white text-black w-full max-w-full mx-auto">
      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10"
            icon={<PencilIcon className="w-4 h-4" />}
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Name</label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Brand Name
              </label>
              <Input
                value={form.brandName}
                onChange={(e) => handleChange("brandName", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Street</label>
              <Input
                value={form.street}
                onChange={(e) => handleChange("street", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <Input
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">State</label>
              <Input
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Country
              </label>
              <Input
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Postal Code
              </label>
              <Input
                value={form.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Latitude
              </label>
              <Input
                type="number"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Longitude
              </label>
              <Input
                type="number"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <Input
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Website
              </label>
              <Input
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Star Rating
              </label>
              <Input
                type="number"
                value={form.starRating}
                onChange={(e) => handleChange("starRating", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Check In Time
              </label>
              <Input
                value={form.checkInTime}
                onChange={(e) => handleChange("checkInTime", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Check Out Time
              </label>
              <Input
                value={form.checkOutTime}
                onChange={(e) => handleChange("checkOutTime", e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={isPending}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="pending_approval">Pending Approval</option>
              </select>
            </div>
            <Button type="submit" loading={isPending} disabled={isPending}>
              Update Restaurant
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="relative border-b border-gray-200 p-6 bg-white">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BuildingIcon className="w-6 h-6 text-gray-700" />
                {restaurant.name}
              </CardTitle>
              {restaurant.brandName && (
                <p className="text-gray-500 text-sm mb-3">
                  Brand: {restaurant.brandName}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(restaurant.status)} text-xs font-medium`}
                >
                  {getStatusEmoji(restaurant.status)}{" "}
                  {restaurant.status.replace("_", " ").toUpperCase()}
                </Badge>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  Added {formatDistanceToNow(
                    new Date(restaurant.createdAt)
                  )}{" "}
                  ago
                </span>
              </div>
            </div>
            {restaurant.starRating && (
              <div className="text-right">
                <div className="text-2xl text-black">
                  {formatStarRating(restaurant.starRating)}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            )}
          </div>
        </CardHeader>
      </div>

      <CardContent className="relative p-6 space-y-6">
        {/* Description */}
        {restaurant.description && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner">
            <div className="flex items-start gap-2">
              <InfoIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <MapPinIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-black">Location</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">
                  Address:
                </span>
                <div className="text-sm text-gray-700">
                  <p>{restaurant.street}</p>
                  <p>
                    {restaurant.city}, {restaurant.state}
                  </p>
                  <p>
                    {restaurant.country} {restaurant.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {restaurant.latitude && restaurant.longitude && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">
                    Coordinates:
                  </span>
                  <div className="text-sm text-gray-700 font-mono">
                    {restaurant.latitude}, {restaurant.longitude}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <PhoneIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-black">
              Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="text-sm text-black hover:text-gray-700 hover:underline transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            )}

            {restaurant.email && (
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <a
                    href={`mailto:${restaurant.email}`}
                    className="text-sm text-black hover:text-gray-700 hover:underline transition-colors"
                  >
                    {restaurant.email}
                  </a>
                </div>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Website</p>
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black hover:text-gray-700 hover:underline transition-colors"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Operational Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <ClockIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-black">
              Operational Details
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <ClockIcon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Check-in</p>
              <p className="text-sm font-medium text-black">
                {restaurant.checkInTime || "—"}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <ClockIcon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Check-out</p>
              <p className="text-sm font-medium text-black">
                {restaurant.checkOutTime || "—"}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <StarIcon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Rating</p>
              <p className="text-sm font-medium text-black">
                {restaurant.starRating ? `${restaurant.starRating} ★` : "—"}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <div
                className={`w-5 h-5 mx-auto mb-1 rounded-full flex items-center justify-center text-xs border ${
                  restaurant.status === "active"
                    ? "bg-green-100 border-green-200"
                    : restaurant.status === "inactive"
                      ? "bg-gray-200 border-gray-300"
                      : restaurant.status === "under_maintenance"
                        ? "bg-yellow-100 border-yellow-200"
                        : "bg-blue-100 border-blue-200"
                }`}
              >
                {getStatusEmoji(restaurant.status)}
              </div>
              <p className="text-xs text-gray-400">Status</p>
              <p className="text-sm font-medium text-black capitalize">
                {restaurant.status.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <HashIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-black">
              System Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-inner">
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">
                  Restaurant ID:
                </span>
                <span className="font-mono text-gray-700">{restaurant.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Hotel ID:</span>
                <span className="font-mono text-gray-700">
                  {restaurant.hotelId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">
                  Organization ID:
                </span>
                <span className="font-mono text-gray-700">
                  {restaurant.organizationId}
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-400">Created By:</span>
                <div className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3 text-gray-400" />
                  <span className="font-mono text-gray-700">
                    {restaurant.createdBy}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Created:</span>
                <span className="text-gray-700">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </span>
              </div>
              {restaurant.updatedAt && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-400">Updated:</span>
                  <span className="text-gray-700">
                    {new Date(restaurant.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
