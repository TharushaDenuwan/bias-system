"use client";

import { useGetRoomTypeByID } from "@/features/hotels/queries/use-get-room-type-by-id";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";
import { BedIcon, ImageIcon, Info, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { ManageRoomTypeAmenities } from "./manage-room-type-amenities";
import { ManageRoomTypeImages } from "./manage-room-type-images";

type Props = {
  roomTypeId: string | null;
};

export function UpdateRoomTypeModal({ roomTypeId }: Props) {
  const {
    data: roomTypeData,
    error: roomTypeError,
    isPending,
  } = useGetRoomTypeByID(roomTypeId);
  const [isOpen, setIsOpen] = useState<boolean>(!!roomTypeId);
  const [view, setView] = useState<"photos" | "amenities" | "basic">("photos");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    baseOccupancy: "",
    maxOccupancy: "",
  });

  useEffect(() => {
    if (roomTypeId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [roomTypeId]);

  useEffect(() => {
    if (roomTypeData) {
      setFormData({
        name: roomTypeData.name || "",
        description: roomTypeData.description || "",
        price: roomTypeData.price || "",
        baseOccupancy: roomTypeData.baseOccupancy || "",
        maxOccupancy: roomTypeData.maxOccupancy || "",
      });
    }
  }, [roomTypeData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Basic Info Submitted:", formData);
    // TODO: call mutation / API update
  };

  if (!roomTypeId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-6xl h-[95vh] flex flex-col gap-0 p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {isPending ? (
          <DialogHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </DialogHeader>
        ) : (
          <DialogHeader className="px-6 py-4 border-b flex flex-col gap-1">
            <DialogTitle className="text-2xl font-bold font-heading">
              {roomTypeData?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {roomTypeData?.description ||
                `Manage the details of ${roomTypeData?.name}`}
            </DialogDescription>
          </DialogHeader>
        )}

        <div className="flex-1 overflow-hidden grid grid-cols-5">
          {/* Sidebar */}
          <div className="h-full col-span-1 border-r bg-secondary/50 flex flex-col gap-0.5">
            <Button
              variant={"ghost"}
              size={"lg"}
              icon={<ImageIcon />}
              onClick={() => setView("photos")}
              className={cn(
                "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                {
                  "border-l-4 border-primary bg-secondary": view === "photos",
                }
              )}
            >
              Room Photos
            </Button>
            <Button
              variant={"ghost"}
              size={"lg"}
              icon={<BedIcon />}
              onClick={() => setView("amenities")}
              className={cn(
                "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                {
                  "border-l-4 border-primary bg-secondary":
                    view === "amenities",
                }
              )}
            >
              Room Amenities
            </Button>
            <Button
              variant={"ghost"}
              size={"lg"}
              icon={<Info />}
              onClick={() => setView("basic")}
              className={cn(
                "w-full rounded-none cursor-pointer border-l flex items-center justify-start",
                {
                  "border-l-4 border-primary bg-secondary": view === "basic",
                }
              )}
            >
              Basic Information
            </Button>
          </div>

          <ScrollArea className="h-full col-span-4">
            <div className="w-full h-full flex items-center justify-center">
              {isPending ? (
                <Loader className="size-5 animate-spin" />
              ) : roomTypeError ? (
                <p className="text-red-500">{roomTypeError.message}</p>
              ) : (
                <div className="w-full h-full px-6 py-1">
                  {view === "photos" && (
                    <ManageRoomTypeImages roomType={roomTypeData as any} />
                  )}
                  {view === "amenities" && (
                    <ManageRoomTypeAmenities roomType={roomTypeData as any} />
                  )}
                  {view === "basic" && (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 max-w-2xl"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="name">Room Type Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Deluxe King Room"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Spacious room with a king-sized bed and ocean view."
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="price">Price (USD)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="120.00"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="baseOccupancy">Base Occupancy</Label>
                          <Input
                            id="baseOccupancy"
                            name="baseOccupancy"
                            type="number"
                            value={formData.baseOccupancy}
                            onChange={handleChange}
                            placeholder="2"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="maxOccupancy">Max Occupancy</Label>
                          <Input
                            id="maxOccupancy"
                            name="maxOccupancy"
                            type="number"
                            value={formData.maxOccupancy}
                            onChange={handleChange}
                            placeholder="4"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-background">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
