"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

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
import { CheckCircle2 } from "lucide-react";
import { useCallback } from "react";
import { useCreateRoomType } from "../../queries/rooms.query";
import {
  roomTypeInsertSchema,
  type RoomTypeInsert,
} from "../../schemas/rooms.schema";

type Props = {
  className?: string;
  hotelId: string;
  onSuccess?: () => void;
};

const defaultValues: Partial<RoomTypeInsert> = {
  name: "",
  description: "",
  price: "",
  maxOccupancy: 2,
  baseOccupancy: 2,
  roomSizeSqm: "",
  viewType: "interior",
  status: true,
};

export function CreateRoomTypeForm({ className, hotelId, onSuccess }: Props) {
  const { mutate, isPending } = useCreateRoomType();

  const form = useAppForm({
    validators: { onChange: roomTypeInsertSchema },
    defaultValues: { ...defaultValues, hotelId },
    onSubmit: ({ value }) =>
      mutate({ ...value, hotelId } as RoomTypeInsert, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
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
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Room Type Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="e.g., Deluxe King Room"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="maxOccupancy"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Max Occupancy</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        min="1"
                        max="10"
                        placeholder="2"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
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
              name="description"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Description</field.FormLabel>
                  <field.FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Describe the room type, its features and amenities"
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
              name="price"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Price</field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="100.00"
                      value={field.state.value?.toString() || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="baseOccupancy"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Base Occupancy</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        min="1"
                        max="10"
                        placeholder="2"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="extraBedCapacity"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Extra Bed Capacity</field.FormLabel>
                    <field.FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        min="0"
                        max="5"
                        placeholder="0"
                        value={field.state.value ?? 0}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
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
              name="roomSizeSqm"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Room Size (sq m)</field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="25.5"
                      value={field.state.value?.toString() || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="viewType"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>View Type</field.FormLabel>
                  <field.FormControl>
                    <Select
                      disabled={isPending}
                      value={field.state.value?.toString() || ""}
                      onValueChange={(value) =>
                        field.handleChange(value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select view type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ocean">Ocean View</SelectItem>
                        <SelectItem value="city">City View</SelectItem>
                        <SelectItem value="garden">Garden View</SelectItem>
                        <SelectItem value="mountain">Mountain View</SelectItem>
                        <SelectItem value="pool">Pool View</SelectItem>
                        <SelectItem value="courtyard">
                          Courtyard View
                        </SelectItem>
                        <SelectItem value="street">Street View</SelectItem>
                        <SelectItem value="interior">Interior View</SelectItem>
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="mt-8 flex">
            <Button
              icon={<CheckCircle2 />}
              loading={isPending}
              type="submit"
              className="w-full py-4"
              disabled={!hotelId}
            >
              Create Room Type
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
