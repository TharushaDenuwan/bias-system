"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
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
import { useState } from "react";
import { useAddRestaurantImage } from "../actions/use-add-restaurant-images";
import { useGetCurrentUserRestaurantImages } from "../actions/use-get-restaurant-images";
import { useUpdateRestaurantImage } from "../actions/use-update-restaurant-image";
import React from "react";

export type RestaurantImage = {
  id: string;
  restaurantId: string;
  imageUrl: string;
  altText?: string | null;
  displayOrder?: number | null;
  isThumbnail?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
};

export function SortableImage({
  image,
  onImageClick,
}: {
  image: RestaurantImage;
  onImageClick: (image: RestaurantImage) => void;
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className="drag-handle absolute top-1 left-1 bg-black/70 rounded p-1 z-10
                  cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100
                  transition-opacity"
        {...attributes}
        {...listeners}
      >
        <LayoutGridIcon className="size-3 text-white" />
      </div>
      <Image
        className="size-20 rounded-md aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
        width={200}
        height={200}
        src={image.imageUrl}
        alt={image.altText || ""}
        onClick={() => onImageClick(image)}
        draggable={false}
      />
      {image.isThumbnail && (
        <div className="absolute top-1 right-1 bg-yellow-500 p-0.5 rounded-full">
          <StarIcon size={12} className="text-white" />
        </div>
      )}
    </div>
  );
}

export function ManageRestaurantImages({
  className,
  restaurantId,
}: {
  className?: string;
  restaurantId?: string;
}) {
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<RestaurantImage | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get images for current restaurant using the correct hook
  const {
    data,
    isPending: loadingImages,
    error: loadingError,
  } = useGetCurrentUserRestaurantImages();

  // Use images and restaurantId from the hook if not provided
  const images = data?.restaurantImages || [];
  const effectiveRestaurantId = restaurantId || data?.restaurantId;

  // Local state for images to support drag-and-drop reordering
  const [localImages, setLocalImages] = useState<RestaurantImage[]>(images);

  // Sync localImages with images when images change
  React.useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const { mutate: addImage, isPending: uploadingImages } =
    useAddRestaurantImage();
  const { mutate: updateImage, isPending: updatingImage } =
    useUpdateRestaurantImage();

  // Removed localImages and useEffect to prevent infinite loop

  const handleImageClick = (image: RestaurantImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleMarkAsThumbnail = () => {
    if (!selectedImage || !effectiveRestaurantId) return;
    const currentThumbnail = images.find((img) => img.isThumbnail);
    // Unset previous thumbnail and set new one
    if (currentThumbnail && currentThumbnail.id !== selectedImage.id) {
      updateImage(
        {
          ...currentThumbnail,
          restaurantId: effectiveRestaurantId,
          isThumbnail: false,
        },
        {
          onSuccess: () => {
            updateImage(
              {
                ...selectedImage,
                restaurantId: effectiveRestaurantId,
                isThumbnail: true,
              },
              { onSuccess: () => setImageDialogOpen(false) }
            );
          },
        }
      );
    } else {
      updateImage(
        {
          ...selectedImage,
          restaurantId: effectiveRestaurantId,
          isThumbnail: true,
        },
        { onSuccess: () => setImageDialogOpen(false) }
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // If you want to support drag-and-drop reordering, use a separate state for UI only
      // Example: setOrderedImages(arrayMove(images, oldIndex, newIndex));
      setHasOrderChanged(true);
    }
  };

  const handleSaveChanges = () => {
    if (!hasOrderChanged || !effectiveRestaurantId) return;
    setIsSaving(true);
    // Update displayOrder for all images
    Promise.all(
      localImages.map((image, index) =>
        updateImage(
          {
            ...image,
            restaurantId: effectiveRestaurantId,
            displayOrder: index + 1,
          },
          { onSuccess: () => {}, onError: () => {} }
        )
      )
    ).finally(() => {
      setHasOrderChanged(false);
      setIsSaving(false);
    });
  };

  // If no restaurantId, show message and disable gallery
  if (!effectiveRestaurantId) {
    return (
      <div className={className}>
        No restaurant found. Please create a restaurant first.
      </div>
    );
  }

  return (
    <>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={async (selectedFiles) => {
            selectedFiles.forEach((file, index) => {
              addImage({
                restaurantId: effectiveRestaurantId,
                imageUrl: file.url,
                altText: file.filename,
                displayOrder: localImages.length + index + 1,
              });
            });
            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

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
                  alt={selectedImage.altText || "Restaurant image"}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className={cn("p-3 pt-5 rounded-sm shadow-none", className)}>
        <CardHeader>
          <CardTitle className="text-xl">Manage Restaurant Images</CardTitle>
          <CardDescription>
            Upload and manage images for your restaurant.
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
              onClick={() => setShowGallery(true)}
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

            {localImages && localImages.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localImages.map((item) => item.id)}
                  strategy={rectSortingStrategy}
                >
                  {localImages.map((image) => (
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

          {localImages && localImages.length > 0 && (
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
              setLocalImages(images);
              setHasOrderChanged(false);
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
