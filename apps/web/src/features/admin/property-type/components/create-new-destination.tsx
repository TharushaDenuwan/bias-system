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
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useCreateDestination } from "../actions/create-action";
import {
  destinationInsertSchema,
  type destinationInsertType,
} from "../schemas";

const defaultValues: Partial<destinationInsertType> = {
  title: "",
  slug: "",
  content: "",
  featuredImage: "",
  latitude: undefined,
  longitude: undefined,
  category: "",
  popularityScore: 0,
  recommended: false,
};

export function CreateDestination({
  triggerRef,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateDestination();
  const [open, setOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const form = useAppForm({
    validators: { onChange: destinationInsertSchema },
    defaultValues,
    onSubmit: ({ value }) =>
      mutate(value as destinationInsertType, {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["destinations"] });
        },
      }),
  });

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
          icon={<PlusCircleIcon />}
          type="button"
          onClick={() => setOpen(true)}
        >
          Create new Destination
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Destination</DialogTitle>
        </DialogHeader>
        <Card className="w-full rounded-sm shadow-none border-none">
          <CardHeader>
            <CardDescription>
              Provide the details of the destination
            </CardDescription>
          </CardHeader>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-y-5 mb-6">
                <form.AppField
                  name="title"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel className="required">
                        Title <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter destination title"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
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
                      <field.FormLabel className="required">
                        Slug <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Enter slug"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          required
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
                      <field.FormLabel className="required">
                        Category <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          disabled={isPending}
                          value={field.state.value || ""}
                          onValueChange={(value) => field.handleChange(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Property Type">
                              Property Type
                            </SelectItem>
                            <SelectItem value="Popular Destinations">
                              Popular Destinations
                            </SelectItem>
                            <SelectItem value="Region">Region</SelectItem>
                            <SelectItem value="Nearby Places">
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
                            <span className="text-sm text-muted-foreground">
                              Image selected
                            </span>
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
              <CardFooter>
                <Button type="submit" loading={isPending} disabled={isPending}>
                  Create Destination
                </Button>
              </CardFooter>
            </form>
          </form.AppForm>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
