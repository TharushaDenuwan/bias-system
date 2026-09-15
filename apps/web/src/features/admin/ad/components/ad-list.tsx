"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { useSearchParams } from "next/navigation";
import { useGetAds } from "../actions/use-get-ad";
import { AdCard } from "./ad-card";
import { AdPagination } from "./ad-pagination";
import { SearchBar } from "./search-bar";

export default function AdList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sort =
    (searchParams.get("sort") as "asc" | "desc" | undefined) || "desc";

  const { data, isLoading, isError, error, refetch } = useGetAds({
    page,
    limit,
    search,
    sort,
  });

  console.log("AdList data:", data);

  // Correct response shape: { data: ad[], meta: { totalPages, page } }
  const ads = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.meta?.totalPages || 1;
  const currentPage = data?.meta?.page || page;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {ads.length} {ads.length === 1 ? "ad" : "ads"} found
        </div>
      </div>

      {/* Ad List */}
      {ads.length === 0 ? (
        <Card className="bg-cyan-50 border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-cyan-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-600"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No ads found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results found for "${search}". Try a different search term.`
                : "Create a new ad to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <AdPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
