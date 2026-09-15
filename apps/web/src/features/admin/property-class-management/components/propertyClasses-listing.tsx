"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetPropertyClass } from "../api/use-get-propertyClasses";
import { columns } from "./propertyClass-table/columns";
import { usePropertyClassTableFilters } from "./propertyClass-table/use-propertyClasses-table-filters";

export default function PropertyClassListing() {
  const { page, limit, searchQuery } = usePropertyClassTableFilters();

  const { data, error, isPending } = useGetPropertyClass({
    limit,
    page,
    search: searchQuery,
  });

  if (isPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable columns={columns} data={data as any} totalItems={data.length} />
  );
}
