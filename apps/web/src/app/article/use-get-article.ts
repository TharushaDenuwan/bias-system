import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Article {
  id: string;
  organizationId: string | null;
  userId: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ArticleFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetArticles = (params: ArticleFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  return useQuery({
    queryKey: ["articles", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const articlesRes = await rpcClient.api.article.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!articlesRes.ok) {
        const errorData = await articlesRes.json();
        throw new Error(errorData.message || "Failed to fetch articles");
      }

      const response: ArticlesResponse = await articlesRes.json();
      return response;
    },
  });
};
