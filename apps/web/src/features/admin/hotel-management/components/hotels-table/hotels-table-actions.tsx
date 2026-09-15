"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { HotelTypesDropdown } from "@/features/hotels/components/hotel-types-dropdown";
import { PropertyClassDropdown } from "@/features/hotels/components/property-class-dropdown";
import { useHotelsTableFilters } from "./use-hotels-table-filters";

type Props = {};

export function HotelsTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    setHotelType,

    setPropertyClass,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive
  } = useHotelsTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex-1">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <HotelTypesDropdown
          showHintText={false}
          className="max-w-[200px] overflow-hidden"
          onSelect={(hotelType) => setHotelType(hotelType?.id || null)}
        />
        <PropertyClassDropdown
          showHintText={false}
          className="max-w-[200px] overflow-hidden"
          onSelect={(propertyClass) =>
            setPropertyClass(propertyClass?.id || null)
          }
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
}
