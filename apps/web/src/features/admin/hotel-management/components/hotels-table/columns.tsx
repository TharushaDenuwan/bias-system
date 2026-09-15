"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { HotelSelectType } from "@/features/hotels/schemas/hotel.schema";
import { Badge } from "@repo/ui/components/badge";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<HotelSelectType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      if (row.original.images.length > 0) {
        let thumbnail = row.original.images.filter(
          (image) => image.isThumbnail
        )[0];
        if (!thumbnail) {
          thumbnail = row.original.images[0];
        }

        return (
          <div className="flex items-center gap-3">
            <Image
              alt={row.original.name}
              src={thumbnail?.imageUrl!}
              width={50}
              height={50}
              className="size-8 rounded-md object-cover"
            />

            <p>{row.original.name}</p>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-sm text-primary-foreground">
              {row.original.name.slice(0, 2)}
            </div>
            <p>{row.original.name}</p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "hotelType",
    header: "Hotel Type",
    cell: ({ row }) => (
      <Badge variant={"outline"}>{row.original.hotelType?.name}</Badge>
    ),
  },
  {
    accessorKey: "propertyClass",
    header: "Property Class",
    cell: ({ row }) => (
      <Badge variant={"outline"}>{row.original.propertyClass?.name}</Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original} hotelId={row.original.id} />
    ),
  },
];
