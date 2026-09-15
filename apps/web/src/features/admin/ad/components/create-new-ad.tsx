"use client";

import GalleryView from "@/modules/media/components/gallery-view";
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
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateAd } from "../actions/use-create-ad";
import { adInsertType } from "../schemas";

const initialState: adInsertType = {
  hotelId: "",
  roomId: "",
  restaurantId: "",
  title: "",
  description: "",
  imageUrl: "",
  redirectUrl: "",
  startDate: "",
  endDate: "",
  isActive: "",
  priority: "",
  placement: "",
};

export function CreateNewAd() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<adInsertType>(initialState);
  const [showGallery, setShowGallery] = useState(false);
  const createAd = useCreateAd();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert empty strings to null for optional fields
      const payload: adInsertType = {
        ...formData,
        hotelId: formData.hotelId || null,
        roomId: formData.roomId || null,
        restaurantId: formData.restaurantId || null,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
        redirectUrl: formData.redirectUrl || null,
        isActive: formData.isActive || null,
        priority: formData.priority || null,
        placement: formData.placement || null,
      };
      await createAd.mutateAsync(payload);
      toast.success("Ad created successfully!");
      setFormData(initialState);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Ad</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new ad. Required fields are
              marked with *.
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
                    value={formData.title}
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
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-medium">Image</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={formData.imageUrl}
                          alt="ad-image"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, imageUrl: "" }))
                          }
                          aria-label="Remove image"
                        >
                          <Trash2Icon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-blue-400 rounded hover:bg-blue-50 transition"
                      aria-label="Add image"
                    >
                      <PlusIcon className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                  <GalleryView
                    modal={true}
                    activeTab="library"
                    onUseSelected={(selectedFiles: { url: string }[]) => {
                      if (selectedFiles.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          imageUrl: selectedFiles[0].url,
                        }));
                      }
                      setShowGallery(false);
                    }}
                    modalOpen={showGallery}
                    setModalOpen={setShowGallery}
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
                    value={formData.redirectUrl || ""}
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
                    value={formData.startDate || ""}
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
                    value={formData.endDate || ""}
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
                    value={formData.priority || ""}
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
                    value={formData.placement || ""}
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
                    value={formData.hotelId || ""}
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
                    value={formData.roomId || ""}
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
                    value={formData.restaurantId || ""}
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
              {isSubmitting ? "Creating..." : "Create Ad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAd;
