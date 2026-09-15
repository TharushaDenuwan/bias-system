"use client";

import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useGetHotelTypes } from "../api/use-get-hotel-types";

export default function HotelTypesListing() {
  const { data, error, isPending } = useGetHotelTypes({});

  if (isPending) {
    return (
      <div className="border rounded-md p-4">
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    );
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <div className="border rounded-md p-4 text-red-600">
        Error loading hotel types.
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((hotelType: any) => (
            <TableRow key={hotelType.id}>
              <TableCell>{hotelType.name}</TableCell>
              <TableCell>{hotelType.slug ?? "-"}</TableCell>
              <TableCell>{hotelType.createdAt}</TableCell>
              <TableCell>{hotelType.updatedAt ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
