"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetHotels } from "../api/use-get-hotels";
import { columns } from "./hotels-table/columns";
import { useHotelsTableFilters } from "./hotels-table/use-hotels-table-filters";

export default function HotelsListing() {
  const { page, limit, searchQuery, hotelType, propertyClass } =
    useHotelsTableFilters();

  const { data, error, isPending } = useGetHotels({
    limit,
    page,
    search: searchQuery,
    hotelType,
    propertyClass
  });

  if (isPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data as any}
      totalItems={data.data.length}
    />
  );
}
