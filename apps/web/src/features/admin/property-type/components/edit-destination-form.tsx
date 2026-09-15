"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateDestination } from "../actions/update-action";
import {
  destinationUpdateSchema,
  type destination,
  type destinationUpdateType,
} from "../schemas";

interface EditDestinationFormProps {
  destination: destination;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export function EditDestinationForm({
  destination,
  triggerRef,
}: EditDestinationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateDestination();
  const [open, setOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  // Default values from existing destination
  const defaultValues: Partial<destinationUpdateType> = {
    title: destination.title || "",
    slug: destination.slug || "",
    content: destination.content || "",
    featuredImage: destination.featuredImage || "",
    latitude: destination.latitude || undefined,
    longitude: destination.longitude || undefined,
    category: destination.category || "",
    popularityScore: destination.popularityScore || 0,
    recommended: destination.recommended || false,
  };

  const form = useAppForm({
    validators: { onChange: destinationUpdateSchema },
    defaultValues,
    onSubmit: ({ value }) => {
      // Filter out undefined values to only send changed fields
      const updateData = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== undefined)
      ) as destinationUpdateType;

      mutate(
        { id: destination.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Destination updated successfully");
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["destinations"] });
            queryClient.invalidateQueries({
              queryKey: ["destination", destination.id],
            });
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update destination");
          },
        }
      );
    },
  });

  // Reset form when destination changes
  useEffect(() => {
    form.reset();
  }, [destination.id, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          size="sm"
          icon={<EditIcon className="h-4 w-4" />}
          type="button"
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
        </DialogHeader>
        <Card className="w-full rounded-sm shadow-none border-none">
          <CardHeader>
            <CardDescription>
              Update the destination details below
            </CardDescription>
          </CardHeader>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-y-5 mb-6">
                <form.AppField
                  name="title"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Title</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter destination title"
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
                  name="slug"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Slug</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter slug (optional)"
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
                  name="content"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Content</field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Enter destination content"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          rows={4}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="category"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Category</field.FormLabel>
                      <field.FormControl>
                        <Select
                          disabled={isPending}
                          value={field.state.value || ""}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="city">property type</SelectItem>
                            <SelectItem value="beach">
                              Popular Destinations
                            </SelectItem>
                            <SelectItem value="mountain">Region</SelectItem>
                            <SelectItem value="historical">
                              Nearby Places
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <form.AppField
                    name="latitude"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Latitude</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            type="number"
                            step="any"
                            placeholder="Enter latitude"
                            value={field.state.value?.toString() || ""}
                            onChange={(e) =>
                              field.handleChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="longitude"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Longitude</field.FormLabel>
                        <field.FormControl>
                          <Input
                            disabled={isPending}
                            type="number"
                            step="any"
                            placeholder="Enter longitude"
                            value={field.state.value?.toString() || ""}
                            onChange={(e) =>
                              field.handleChange(
                                parseFloat(e.target.value) || undefined
                              )
                            }
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>
                <form.AppField
                  name="popularityScore"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Popularity Score</field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter popularity score (0-100)"
                          value={field.state.value?.toString() || "0"}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="recommended"
                  children={(field) => (
                    <field.FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <field.FormControl>
                        <Checkbox
                          disabled={isPending}
                          checked={field.state.value || false}
                          onCheckedChange={(checked) =>
                            field.handleChange(!!checked)
                          }
                        />
                      </field.FormControl>
                      <div className="space-y-1 leading-none">
                        <field.FormLabel>
                          Recommended Destination
                        </field.FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Mark this destination as recommended for featured
                          display
                        </p>
                      </div>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="featuredImage"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Featured Image</field.FormLabel>
                      <field.FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setMediaDialogOpen(true)}
                            >
                              Choose from Media
                            </Button>
                            {field.state.value && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.handleChange("")}
                              >
                                Remove Image
                              </Button>
                            )}
                          </div>
                          {field.state.value && (
                            <div className="flex items-center gap-2">
                              <img
                                src={field.state.value}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded border"
                              />
                              <span className="text-sm text-muted-foreground">
                                Current image
                              </span>
                            </div>
                          )}
                        </div>
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
                {/* Media Picker Dialog */}
                <GalleryView
                  modal={true}
                  modalOpen={mediaDialogOpen}
                  setModalOpen={setMediaDialogOpen}
                  activeTab="library"
                  onUseSelected={(selectedFiles) => {
                    if (selectedFiles && selectedFiles.length > 0) {
                      // Use the first selected media file's url
                      form.setFieldValue("featuredImage", selectedFiles[0].url);
                      setMediaDialogOpen(false);
                    }
                  }}
                />
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isPending} disabled={isPending}>
                  Update Destination
                </Button>
              </CardFooter>
            </form>
          </form.AppForm>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
