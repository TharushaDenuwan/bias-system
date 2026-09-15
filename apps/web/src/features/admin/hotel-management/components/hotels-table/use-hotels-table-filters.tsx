"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { searchParams } from "@/lib/searchparams";

export function useHotelsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [hotelType, setHotelType] = useQueryState(
    "type",
    searchParams.hotelType
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [propertyClass, setPropertyClass] = useQueryState(
    "class",
    searchParams.propertyClass
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);

    setPage(1);
    setLimit(10);

    setHotelType(null);
    setPropertyClass(null);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      !!hotelType ||
      !!propertyClass ||
      page > 1 ||
      limit !== 10
    );
  }, [searchQuery, hotelType, propertyClass]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Hotel Type
    hotelType,
    setHotelType,

    // Property Class
    propertyClass,
    setPropertyClass,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    // Reset
    resetFilters,
    isAnyFilterActive
  };
}
