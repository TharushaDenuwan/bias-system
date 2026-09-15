"use client";

import { RoomTypeWithRelations } from "@/features/hotels/schemas/rooms.schema";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Loader2, PlusIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAddRoomTypeImages } from "../../../queries/use-add-room-type-images";
import { useGetRoomTypeImages } from "../../../queries/use-get-room-type-images-by-id";

type RoomTypeImage = {
  id: string;
  hotelId: string;
  roomTypeId: string | null;
  imageUrl: string;
  altText: string | null;
  displayOrder: number | null;
  isThumbnail: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

type Props = {
  roomType: RoomTypeWithRelations;
};

export function ManageRoomTypeImages({ roomType }: Props) {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<RoomTypeImage | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const { data: imagesData, isPending: loadingImages } = useGetRoomTypeImages(
    roomType.id
  );
  const { mutate: addImages, isPending: uploadingImages } =
    useAddRoomTypeImages(roomType.id);

  const handleImageClick = (image: RoomTypeImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const images = imagesData?.data || [];

  return (
    <>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles) => {
            addImages(
              selectedFiles.map((file, index) => ({
                imageUrl: file.url,
                altText: file.filename,
                displayOrder: images.length + index + 1,
                isThumbnail: index === 0 && images.length === 0 ? true : null,
              }))
            );
            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Room Type Image Preview</DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full aspect-video">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || "Room type image"}
                  fill
                  className="object-contain"
                />
                {selectedImage.isThumbnail && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-md flex items-center gap-1">
                    <StarIcon size={16} />
                    <span className="text-xs">Thumbnail</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedImage.altText}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-3">
        <div>
          <h2 className="text-lg font-semibold">Room Type Images</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage images for {roomType.name}.
          </p>
        </div>

        <div className="mt-3 flex flex-row gap-3 flex-wrap">
          <div
            onClick={() => setShowGallery(true)}
            className="size-20 hover:bg-secondary/60 cursor-pointer rounded-md border-dashed border border-primary/30 flex items-center justify-center"
          >
            {uploadingImages ? (
              <Loader2 className="size-12 text-primary/60 animate-spin" />
            ) : (
              <PlusIcon className="text-primary/60 size-12" strokeWidth={1} />
            )}
          </div>

          {loadingImages &&
            Array(4)
              .fill("_")
              .map((_, index) => <Skeleton key={index} className="size-20" />)}

          {images.length > 0 &&
            images.map((image) => (
              <div key={image.id} className="relative size-20">
                <Image
                  className="rounded-md aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  width={200}
                  height={200}
                  src={image.imageUrl}
                  alt={image.altText || ""}
                  onClick={() => handleImageClick(image)}
                />
                {image.isThumbnail && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-white p-1 rounded-full">
                    <StarIcon size={12} />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
