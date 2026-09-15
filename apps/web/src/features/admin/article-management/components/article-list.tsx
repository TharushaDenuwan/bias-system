"use client";

import { useSearchParams } from "next/navigation";
import { useGetArticles } from "../api/use-get-article";
import { article } from "../schemas";
import { ArticleCard } from "./article-card";
import { ArticlePagination } from "./article-pagination";
import { SearchBar } from "./search-bar";

export function ArticleList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const { data, isLoading, isError } = useGetArticles({
    page,
    limit: 10,
    sort: "desc",
    search,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading articles...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load articles.
      </div>
    );
  }

  const articles: article[] = data.data || [];
  const meta = data.meta || { currentPage: 1, totalPages: 1 };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Articles</h2>
        <SearchBar />
      </div>
      <div className="flex flex-col gap-4">
        {articles.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No articles found.
          </div>
        ) : (
          articles.map((item) => <ArticleCard key={item.id} article={item} />)
        )}
      </div>
      <ArticlePagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
