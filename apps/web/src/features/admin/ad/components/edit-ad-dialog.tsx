"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  CalendarIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateAd } from "../actions/use-update-ad";
import type { ad, adUpdateType } from "../schemas";

function toStr(val: any) {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

interface Props {
  ad: ad;
}

export default function EditAdDialog({ ad }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<adUpdateType>({
    hotelId: toStr(ad.hotelId),
    roomId: toStr(ad.roomId),
    restaurantId: toStr(ad.restaurantId),
    title: toStr(ad.title),
    description: toStr(ad.description),
    imageUrl: toStr(ad.imageUrl),
    redirectUrl: toStr(ad.redirectUrl),
    startDate: ad.startDate
      ? new Date(ad.startDate).toISOString().split("T")[0]
      : "",
    endDate: ad.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "",
    isActive: ad.isActive !== null ? String(ad.isActive) : "",
    priority: toStr(ad.priority),
    placement: toStr(ad.placement),
  });
  const updateAd = useUpdateAd();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: toStr(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert and validate data types properly
      const payload: adUpdateType = {
        hotelId: formData.hotelId?.trim() || null,
        roomId: formData.roomId?.trim() || null,
        restaurantId: formData.restaurantId?.trim() || null,
        title: formData.title?.trim() || "",
        description: formData.description?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        redirectUrl: formData.redirectUrl?.trim() || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: formData.isActive === "true" || formData.isActive === true,
        priority: formData.priority?.trim() || null,
        placement: formData.placement?.trim() || null,
      };

      console.log("Payload being sent:", payload);
      await updateAd.mutateAsync({ id: toStr(ad.id), data: payload });
      toast.success("Ad updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 px-2">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Ad</DialogTitle>
            <DialogDescription>
              Make changes to your ad below. Required fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-4">
            {/* Section 1: Ad Information */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Ad Information
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter ad title"
                    value={toStr(formData.title)}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the ad"
                    value={toStr(formData.description)}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl" className="font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="https://..."
                    value={toStr(formData.imageUrl)}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="redirectUrl" className="font-medium">
                    Redirect URL
                  </Label>
                  <Input
                    id="redirectUrl"
                    name="redirectUrl"
                    placeholder="https://..."
                    value={toStr(formData.redirectUrl)}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Ad Configuration */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                Ad Configuration
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate" className="font-medium">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={toStr(formData.startDate)}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate" className="font-medium">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={toStr(formData.endDate)}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isActive" className="font-medium">
                    Is Active
                  </Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={
                        formData.isActive === "true" ||
                        formData.isActive === true
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked ? "true" : "false",
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="isActive" className="text-sm font-normal">
                      Make this ad active
                    </Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority" className="font-medium">
                    Priority
                  </Label>
                  <Input
                    id="priority"
                    name="priority"
                    placeholder="high, normal, low"
                    value={toStr(formData.priority)}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="placement" className="font-medium">
                    Placement
                  </Label>
                  <Input
                    id="placement"
                    name="placement"
                    placeholder="homepage, search results, etc."
                    value={toStr(formData.placement)}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Relations */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
                Relations
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotelId" className="font-medium">
                    Hotel ID
                  </Label>
                  <Input
                    id="hotelId"
                    name="hotelId"
                    placeholder="Hotel ID"
                    value={toStr(formData.hotelId)}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roomId" className="font-medium">
                    Room ID
                  </Label>
                  <Input
                    id="roomId"
                    name="roomId"
                    placeholder="Room ID"
                    value={toStr(formData.roomId)}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="restaurantId" className="font-medium">
                    Restaurant ID
                  </Label>
                  <Input
                    id="restaurantId"
                    name="restaurantId"
                    placeholder="Restaurant ID"
                    value={toStr(formData.restaurantId)}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 px-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
