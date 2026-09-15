"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLinkIcon,
  LinkIcon,
  MapIcon,
  MapPinIcon,
  StarIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { useDeleteDestination } from "../actions/delete-action";
import type { destination } from "../schemas";
import { EditDestinationForm } from "./edit-destination-form";

type Props = {
  destination: destination;
};

export function DestinationCard({ destination }: Props) {
  const id = useId();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteDestination, isPending: isDeleting } =
    useDeleteDestination();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    deleteDestination(destination.id, {
      onSuccess: () => {
        toast.success("Destination deleted successfully");
        setShowDeleteDialog(false);
        queryClient.invalidateQueries({ queryKey: ["destinations"] });
      },
      onError: () => {
        toast.error("Failed to delete destination");
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-emerald-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={destination.featuredImage ?? ""}
              alt={destination.title}
              className="size-16"
            />
            <AvatarFallback className="bg-emerald-50 text-emerald-700">
              <MapPinIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {destination.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(new Date(destination.createdAt))}{" "}
                  ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {destination.category && (
                <Badge variant="secondary" className="text-xs">
                  {destination.category}
                </Badge>
              )}
              {destination.popularityScore !== null &&
                destination.popularityScore > 0 && (
                  <>
                    <div className="text-gray-300 text-sm px-1">|</div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-sm">
                        {destination.popularityScore} popularity
                      </span>
                    </div>
                  </>
                )}
              {destination.userId && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm truncate max-w-[120px]">
                      {destination.userId}
                    </span>
                  </div>
                </>
              )}
              {destination.slug && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-xs text-muted-foreground">
                    {destination.slug}
                  </span>
                </>
              )}
              {(destination.latitude || destination.longitude) && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <MapIcon className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      {destination.latitude?.toFixed(4)},{" "}
                      {destination.longitude?.toFixed(4)}
                    </span>
                  </div>
                </>
              )}
              {destination.content && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="truncate max-w-[180px] text-xs text-muted-foreground">
                    {destination.content}
                  </span>
                </>
              )}
              {destination.featuredImage && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-teal-500" />
                    <a
                      href={destination.featuredImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline truncate max-w-[180px] text-sm"
                    >
                      Image
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {destination.recommended && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs w-fit"
              >
                Recommended
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs w-fit"
            >
              Active
            </Badge>
            <EditDestinationForm destination={destination} />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/admin/property-type/${destination.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the destination "{destination.title}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Destination"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
