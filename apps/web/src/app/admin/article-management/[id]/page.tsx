"use client";

import { useParams } from "next/navigation";
import { useGetArticles } from "@/features/admin/article-management/api/use-get-article";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { formatDistanceToNow } from "date-fns";

export default function ArticleDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";
  const { data, isLoading, isError } = useGetArticles({
    page: 1,
    limit: 1,
    sort: "desc",
    search: "",
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading article...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load article.
      </div>
    );
  }

  const article = data.data?.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Article not found.
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">{article.title}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
          >
            Published
          </Badge>
          <span className="text-xs text-muted-foreground">
            Added {formatDistanceToNow(new Date(article.createdAt))} ago
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="rounded w-full max-h-64 object-cover mb-4"
          />
        )}
        {article.excerpt && (
          <div>
            <span className="font-semibold">Excerpt:</span>
            <p className="text-muted-foreground">{article.excerpt}</p>
          </div>
        )}
        {article.content && (
          <div>
            <span className="font-semibold">Content:</span>
            <p>{article.content}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="font-semibold">User ID:</span>
            <p>{article.userId}</p>
          </div>
          <div>
            <span className="font-semibold">Slug:</span>
            <p>{article.slug ?? "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
