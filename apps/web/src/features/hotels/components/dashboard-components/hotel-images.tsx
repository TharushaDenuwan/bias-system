"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";
import {
  LayoutGridIcon,
  Loader2,
  PlusIcon,
  Star,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAddHotelImages } from "../../queries/use-add-hotel-images";
import { useGetHotelImages } from "../../queries/use-get-hotel-images";
import { useRemoveHotelImages } from "../../queries/use-remove-hotel-images";
import { useUpdateHotelImages } from "../../queries/use-update-hotel-image";
import { HotelImage } from "../../schemas/hotel.schema";

type Props = {
  className?: string;
};

const IMAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_IMAGE_LIMIT || "20", 10);

// Sortable item component
export function SortableImage({
  image,
  onImageClick,
}: {
  image: HotelImage;
  onImageClick: (image: HotelImage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    // Only allow dragging from the handle
    // modifiers: [
    //   {
    //     name: "restrictToHandleSelector",
    //     options: {
    //       handles: [".drag-handle"]
    //     }
    //   }
    // ]
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Function to handle image click
  const handleClick = () => {
    onImageClick(image);
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle in the top-left corner */}
      <div
        className="drag-handle absolute top-1 left-1 bg-black/70 rounded p-1 z-10
                  cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100
                  transition-opacity"
        {...attributes}
        {...listeners}
      >
        <LayoutGridIcon className="size-3 text-white" />
      </div>

      {/* Image - now clickable without drag interference */}
      <Image
        className="size-20 rounded-md aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
        width={200}
        height={200}
        src={image.imageUrl}
        alt={image.altText || ""}
        onClick={handleClick}
        draggable={false}
      />

      {/* Thumbnail indicator */}
      {image.isThumbnail && (
        <div className="absolute top-1 right-1 bg-yellow-500 p-0.5 rounded-full">
          <StarIcon size={12} className="text-white" />
        </div>
      )}
    </div>
  );
}

export function ManageHotelImages({ className }: Props) {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<HotelImage | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [images, setImages] = useState<HotelImage[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: hotelImages,
    isPending: loadingImages,
    error: loadingError,
    refetch: refetchImages,
  } = useGetHotelImages();

  const { mutate: addImages, isPending: uploadingImages } = useAddHotelImages();
  const { mutate: updateImages, isPending: updatingImage } =
    useUpdateHotelImages();
  const { mutate: removeImage, isPending: removingImage } =
    useRemoveHotelImages();

  // Set initial images when data is loaded
  useEffect(() => {
    if (hotelImages) {
      setImages(hotelImages as any);
    }
  }, [hotelImages]);

  const handleImageClick = (image: HotelImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleMarkAsThumbnail = () => {
    if (!selectedImage) return;

    // Find current thumbnail image if exists
    const currentThumbnail = images.find((img) => img.isThumbnail);

    // Update selected image to be thumbnail
    updateImages(
      [
        {
          ...selectedImage,
          isThumbnail: true,
        },
        // If there was a current thumbnail, unset it
        ...(currentThumbnail && currentThumbnail.id !== selectedImage.id
          ? [{ ...currentThumbnail, isThumbnail: false }]
          : []),
      ],
      {
        onSuccess: () => {
          // Optionally close the dialog
          setImageDialogOpen(false);
        },
      }
    );
  };

  const handleRemoveImage = (imageId: string) => {
    if (confirm("Are you sure you want to remove this image?")) {
      removeImage(imageId, {
        onSuccess: () => {
          refetchImages();
          setImageDialogOpen(false);
        },
      });
    }
  };

  // Handle drag end event for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasOrderChanged(true);
        return newOrder;
      });
    }
  };

  // Save the new order
  const handleSaveChanges = () => {
    if (!hasOrderChanged) return;

    setIsSaving(true);

    // Create array of images with updated display order
    const updatedImages = images.map((image, index) => ({
      ...image,
      displayOrder: index + 1,
    }));

    // Update all images with new order
    updateImages(updatedImages, {
      onSuccess: () => {
        setHasOrderChanged(false);
        setIsSaving(false);
      },
      onError: () => {
        setIsSaving(false);
      },
    });
  };

  return (
    <>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles) => {
            if (images.length + selectedFiles.length > IMAGE_LIMIT) {
              alert(
                `You can only upload up to ${IMAGE_LIMIT} images. Current uploaded: ${images.length}`
              );
              return;
            }

            // Upload images
            addImages(
              selectedFiles.map((file, index) => ({
                imageUrl: file.url,
                altText: file.filename,
                displayOrder: images.length + index + 1,
              })),
              {
                onSuccess: () => {
                  refetchImages();
                  setShowGallery(false);
                },
              }
            );
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full aspect-video">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || "Hotel image"}
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

            <Button
              onClick={handleMarkAsThumbnail}
              disabled={updatingImage || selectedImage?.isThumbnail === true}
              className={cn(
                "flex items-center gap-2",
                selectedImage?.isThumbnail &&
                  "bg-yellow-600 hover:bg-yellow-700"
              )}
            >
              {updatingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              {selectedImage?.isThumbnail
                ? "Current Thumbnail"
                : "Mark as Thumbnail"}
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                selectedImage && handleRemoveImage(selectedImage.id)
              }
              disabled={removingImage}
              className="flex items-center gap-2"
            >
              {removingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className={cn("p-3 pt-5 rounded-sm shadow-none", className)}>
        <CardHeader>
          <CardTitle className="text-xl">Manage Hotel Images</CardTitle>
          <CardDescription>
            Upload and manage images for your hotel listings.
            <span className="block mt-1">
              Current uploaded: {images.length}/{IMAGE_LIMIT}
            </span>
            {hasOrderChanged && (
              <span className="text-amber-600 block mt-1">
                ⓘ You've changed the image order. Don't forget to save your
                changes.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-3 flex-wrap">
            <div
              onClick={() => {
                if (images.length >= IMAGE_LIMIT) {
                  alert(
                    `You have reached the maximum upload limit of ${IMAGE_LIMIT} images.`
                  );
                  return;
                }
                setShowGallery(true);
              }}
              className="size-20 hover:bg-secondary/60 cursor-pointer rounded-md border-dashed border border-primary/30 flex items-center justify-center"
            >
              {uploadingImages ? (
                <Loader2 className="size-12 text-primary/60 animate-spin" />
              ) : (
                <PlusIcon className="text-primary/60 size-12" strokeWidth={1} />
              )}
            </div>

            {loadingError && (
              <div className="text-red-500">{loadingError.message}</div>
            )}

            {loadingImages &&
              Array(4)
                .fill("_")
                .map((item, index) => (
                  <Skeleton key={index} className="size-20" />
                ))}

            {images && images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  {images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

          {images && images.length > 0 && (
            <div className="text-sm text-muted-foreground mt-4">
              <p>
                Drag images to reorder them. The first image will appear first
                in galleries.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              // Reset order if changes were made but not saved
              if (hasOrderChanged && hotelImages) {
                setImages(hotelImages as any);
                setHasOrderChanged(false);
              }
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={!hasOrderChanged || isSaving}
            onClick={handleSaveChanges}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
