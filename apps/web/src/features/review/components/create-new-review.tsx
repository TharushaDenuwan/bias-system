"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter } from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  BedIcon,
  CalendarIcon,
  MapPinIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UtensilsIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useCreateReview } from "../actions/use-create-review";
import {
  reviewNratingInsertSchema,
  type reviewNratingInsertType,
} from "../schemas/index";

const defaultValues: Partial<reviewNratingInsertType> = {
  hotelId: null,
  roomId: null,
  restaurantId: null,
  rating: "",
  reviewTitle: "",
  reviewPositiveText: "",
  reviewNegativeText: "",
  reviewDate: null,
  propertyResponse: "",
  response: "",
};

// Star Rating Component
const StarRating = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const numValue = parseInt(value) || 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star.toString())}
          className={`p-1 rounded-full transition-all duration-200 ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <StarIcon
            className={`w-8 h-8 transition-colors ${
              star <= numValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 hover:fill-yellow-100 hover:text-yellow-100"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {numValue > 0 ? `${numValue}/5` : "Select rating"}
      </span>
    </div>
  );
};

export function CreateReview({
  triggerRef,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateReview();
  const [open, setOpen] = useState(false);

  // Get hotelId from URL
  let hotelId: string | null = null;
  if (typeof window !== "undefined") {
    const match = window.location.pathname.match(/hotels\/([a-zA-Z0-9-]+)/);
    hotelId = match ? match[1] : null;
  }

  const form = useAppForm({
    validators: { onChange: reviewNratingInsertSchema },
    defaultValues: { ...defaultValues, hotelId },
    onSubmit: ({ value }) =>
      mutate({ ...value, hotelId } as reviewNratingInsertType, {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["reviews"] });
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors"
          icon={<PlusCircleIcon className="w-4 h-4" />}
          type="button"
          onClick={() => setOpen(true)}
        >
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold">
              Share Your Experience
            </DialogTitle>
            <p className="text-blue-100 text-sm">
              Help other travelers by sharing your honest review
            </p>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-100px)]">
          <Card className="w-full rounded-none shadow-none border-none">
            <form.AppForm>
              <form onSubmit={handleSubmit}>
                <CardContent className="px-6 py-6 space-y-8">
                  {/* Overall Rating Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <StarIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Overall Rating
                      </h3>
                    </div>
                    <form.AppField
                      name="rating"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                            How would you rate your overall experience?
                          </field.FormLabel>
                          <field.FormControl>
                            <StarRating
                              value={field.state.value}
                              onChange={field.handleChange}
                              disabled={isPending}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  {/* Review Title */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <MessageSquareIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Review Title
                      </h3>
                    </div>
                    <form.AppField
                      name="reviewTitle"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel className="text-sm font-medium text-gray-700">
                            Give your review a title
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="e.g., 'Amazing stay with beautiful views'"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  {/* Positive & Negative Feedback */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <ThumbsUpIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          What You Liked
                        </h3>
                      </div>
                      <form.AppField
                        name="reviewPositiveText"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="text-sm font-medium text-gray-700">
                              Tell us what you enjoyed most
                            </field.FormLabel>
                            <field.FormControl>
                              <Textarea
                                disabled={isPending}
                                placeholder="What made your stay special? Highlight the best parts of your experience..."
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="min-h-[120px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={5}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <ThumbsDownIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Areas for Improvement
                        </h3>
                      </div>
                      <form.AppField
                        name="reviewNegativeText"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="text-sm font-medium text-gray-700">
                              What could be better?
                            </field.FormLabel>
                            <field.FormControl>
                              <Textarea
                                disabled={isPending}
                                placeholder="Was there anything that didn't meet your expectations? Your feedback helps others and the property..."
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="min-h-[120px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={5}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                      Property Details
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      <form.AppField
                        name="hotelId"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <MapPinIcon className="w-4 h-4" />
                              Hotel ID
                            </field.FormLabel>
                            <field.FormControl>
                              <Input
                                readOnly
                                disabled={true}
                                value={hotelId || ""}
                                className="h-11 border-gray-300 focus:border-blue-500 bg-gray-100 text-gray-500"
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="roomId"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <BedIcon className="w-4 h-4" />
                              Room ID
                            </field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                placeholder="Room identifier"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="h-11 border-gray-300 focus:border-blue-500"
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="restaurantId"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <UtensilsIcon className="w-4 h-4" />
                              Restaurant ID
                            </field.FormLabel>
                            <field.FormControl>
                              <Input
                                disabled={isPending}
                                placeholder="Restaurant identifier"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="h-11 border-gray-300 focus:border-blue-500"
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>

                    <form.AppField
                      name="reviewDate"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarIcon className="w-4 h-4" />
                            Review Date
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              disabled={isPending}
                              type="date"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-11 border-gray-300 focus:border-blue-500 max-w-xs"
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                      Additional Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <form.AppField
                        name="propertyResponse"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="text-sm font-medium text-gray-700">
                              Property Response
                            </field.FormLabel>
                            <field.FormControl>
                              <Textarea
                                disabled={isPending}
                                placeholder="Response from the property (if any)"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="min-h-[100px] border-gray-300 focus:border-blue-500"
                                rows={4}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />

                      <form.AppField
                        name="response"
                        children={(field) => (
                          <field.FormItem>
                            <field.FormLabel className="text-sm font-medium text-gray-700">
                              Additional Comments
                            </field.FormLabel>
                            <field.FormControl>
                              <Textarea
                                disabled={isPending}
                                placeholder="Any additional thoughts or comments"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                className="min-h-[100px] border-gray-300 focus:border-blue-500"
                                rows={4}
                              />
                            </field.FormControl>
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-sm text-gray-600">
                      Your review will help other travelers make informed
                      decisions
                    </p>
                    <Button
                      type="submit"
                      loading={isPending}
                      disabled={isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-md transition-colors min-w-[140px]"
                    >
                      {isPending ? "Publishing..." : "Publish Review"}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </form.AppForm>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
