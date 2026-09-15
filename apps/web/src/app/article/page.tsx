"use client";

import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { ArticleCard } from "./components/article-card";
import { useGetArticles } from "./use-get-article";

export default function ArticlePage() {
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useGetArticles({
    limit: 50,
    sort: "desc",
  });

  if (isLoadingArticles) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-0">
                  <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (articlesError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load the articles. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 to-purple-600 bg-clip-text text-transparent mb-6">
              Latest Articles
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover insights, tutorials, and stories from our community of
              writers and experts.
            </p>
          </div>

          {/* Articles Grid */}
          {articlesData?.data && articlesData.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesData.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No Articles Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We're working on bringing you amazing content. Check back soon
                for new articles!
              </p>
            </div>
          )}

          {/* Load More Section (if needed) */}
          {articlesData?.data && articlesData.data.length >= 50 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// "use client";

// import { Footer } from "@/modules/layouts/footer";
// import { Navbar } from "@/modules/layouts/navbar";
// import { Button } from "@repo/ui/components/button";
// import { MessageCircleIcon, StarIcon } from "lucide-react";
// import { useGetArticles } from "./use-get-article";

// export default function ArticlePage() {
//   const {
//     data: articlesData,
//     isLoading: isLoadingArticles,
//     error: articlesError,
//   } = useGetArticles({
//     limit: 50,
//     sort: "desc",
//   });

//   if (isLoadingArticles) {
//     return (
//       <div className="min-h-screen bg-white">
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="border-b border-gray-200 mb-8">
//             <div className="flex gap-8 mb-4">
//               <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
//               <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
//             </div>
//           </div>

//           <div className="space-y-12">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex gap-8 animate-pulse">
//                 <div className="flex-1 space-y-4">
//                   <div className="h-4 bg-gray-200 rounded w-32"></div>
//                   <div className="h-8 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                 </div>
//                 <div className="w-32 h-20 bg-gray-200 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (articlesError) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">📰</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Oops! Something went wrong
//           </h1>
//           <p className="text-gray-600 mb-6">
//             We couldn't load the articles. Please try again later.
//           </p>
//           <Button onClick={() => window.location.reload()} variant="outline">
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen bg-white">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="border-b border-gray-200 mb-8">
//             <div className="flex gap-8">
//               <button className="pb-4 border-b-2 border-black text-black font-medium">
//                 For you
//               </button>
//               <button className="pb-4 text-gray-500 hover:text-gray-700">
//                 Featured
//               </button>
//             </div>
//           </div>

//           {articlesData?.data && articlesData.data.length > 0 ? (
//             <div className="space-y-12">
//               {articlesData.data.map((article, index) => (
//                 <article key={article.id} className="group cursor-pointer">
//                   <div className="flex gap-8">
//                     <div className="flex-1">
//                       {/* Publication info */}
//                       <div className="flex items-center gap-2 mb-3">
//                         <div className="w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center">
//                           <span className="text-white text-xs font-bold">
//                             {(article.category || "C")[0]}
//                           </span>
//                         </div>
//                         <span className="text-sm text-gray-600">
//                           In{" "}
//                           <span className="font-medium">
//                             {article.category || "Codrift"}
//                           </span>{" "}
//                           by{" "}
//                           <span className="font-medium">
//                             {article.author || "Author"}
//                           </span>
//                         </span>
//                       </div>

//                       {/* Title */}
//                       <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
//                         {article.title}
//                       </h2>

//                       {/* Subtitle/Description */}
//                       <p className="text-gray-600 mb-4 leading-relaxed">
//                         {article.description ||
//                           article.content?.substring(0, 150) + "..." ||
//                           "Discover insights and stories from our community of writers."}
//                       </p>

//                       {/* Engagement metrics */}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-6 text-sm text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <StarIcon className="w-4 h-4" />
//                             <span>
//                               {new Date(article.createdAt).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   month: "short",
//                                   day: "numeric",
//                                 }
//                               )}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span className="text-gray-400">👏</span>
//                             <span>
//                               {Math.floor(Math.random() * 1000) + 100}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <MessageCircleIcon className="w-4 h-4" />
//                             <span>{Math.floor(Math.random() * 50) + 1}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Article thumbnail */}
//                     <div className="w-32 h-20 flex-shrink-0">
//                       <img
//                         src={
//                           article.image ||
//                           `/placeholder.svg?height=80&width=128&query=${encodeURIComponent(article.title) || "/placeholder.svg"}`
//                         }
//                         alt={article.title}
//                         className="w-full h-full object-cover rounded"
//                       />
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-6">📝</div>
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 No Articles Yet
//               </h2>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 We're working on bringing you amazing content. Check back soon
//                 for new articles!
//               </p>
//             </div>
//           )}

//           {articlesData?.data && articlesData.data.length >= 50 && (
//             <div className="text-center mt-16 pt-8 border-t border-gray-200">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="px-8 bg-transparent"
//               >
//                 Show more stories
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
