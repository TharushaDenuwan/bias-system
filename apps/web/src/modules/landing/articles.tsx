import { getClient } from "@/lib/rpc/server";
import { Bookmark } from "lucide-react";
import Link from "next/link";

type Article = {
  id: string;
  userId: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type Props = {};

export async function Articles({}: Props) {
  const rpcClient = await getClient();

  // Fetch articles from backend
  const articlesRes = await rpcClient.api.article.$get({
    query: {
      page: "1",
      limit: "9",
      sort: "desc",
      search: "",
    },
  });

  if (!articlesRes.ok) {
    return <></>;
  }

  const apiResponse = await articlesRes.json();
  const articles: Article[] = apiResponse.data || [];

  if (!articles || articles.length === 0) {
    return <></>;
  }

  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 4); // Show 3 articles in sidebar

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#003580] mb-3">
          Explore our latest stories
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Discover news, articles, and travel inspiration
        </p>
        {/* <div className="flex justify-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Read more news
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            Read more articles
          </button>
        </div> */}
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Link
              href={`/articles/${featuredArticle.id}`}
              className="block group relative"
            >
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                {featuredArticle.featuredImage ? (
                  <img
                    src={featuredArticle.featuredImage || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800" />
                )}

                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-white/90 text-gray-900 text-sm font-medium rounded uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <Bookmark className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  {featuredArticle.excerpt && (
                    <p className="text-white/90 text-base mb-2 line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <div className="text-white/80 text-sm">
                    {new Date(featuredArticle.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}{" "}
                    • 5 min read
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            {sidebarArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage || "/placeholder.svg"}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded uppercase tracking-wide">
                          {index === 0
                            ? "Activities"
                            : index === 1
                              ? "Travel"
                              : "Culture"}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="text-gray-500 text-xs">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}{" "}
                        • {Math.floor(Math.random() * 5) + 3} min read
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {apiResponse.meta.totalCount > 4 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/articles"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-medium"
            >
              View All Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
