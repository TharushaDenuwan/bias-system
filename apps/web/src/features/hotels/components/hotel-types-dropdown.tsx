"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/components/popover";

import { useGetHotelTypes } from "../queries/use-get-hotel-types";
import { type HotelType } from "../schemas/hotel.schema";

type Props = {
  onSelect: (hotelType: HotelType | undefined) => void;
  placeholder?: string;
  className?: string;
  showHintText?: boolean;
};

export function HotelTypesDropdown({
  onSelect,
  placeholder = "Select hotel type",
  className,
  showHintText = true
}: Props) {
  const { data, isLoading } = useGetHotelTypes();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelect = (currentValue: string) => {
    const selected = data?.find((item) => item.id === currentValue)!;
    setSelectedValue(currentValue === selectedValue ? "" : currentValue);

    onSelect({
      ...selected,
      createdAt: new Date(selected.createdAt),
      updatedAt: new Date(selected.updatedAt || "")
    });

    setOpen(false);
  };

  const selectedItem = data?.find((item) => item.id === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between pl-1", className)}
          disabled={isLoading}
        >
          {selectedItem ? (
            <span className="flex items-center">
              {selectedItem.thumbnail && (
                <Image
                  src={selectedItem.thumbnail}
                  alt={selectedItem.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover size-7 mr-2"
                />
              )}{" "}
              {showHintText && "Property Type: "} {selectedItem.name}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search hotel type..." />
          <CommandEmpty>No hotel type found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {data?.map((hotelType) => (
              <CommandItem
                key={hotelType.id}
                value={hotelType.id}
                onSelect={handleSelect}
                className="flex items-center gap-2"
              >
                {hotelType.thumbnail && (
                  <div className="relative h-8 w-8 overflow-hidden rounded">
                    <Image
                      src={hotelType.thumbnail}
                      alt={hotelType.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span>{hotelType.name}</span>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedValue === hotelType.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
