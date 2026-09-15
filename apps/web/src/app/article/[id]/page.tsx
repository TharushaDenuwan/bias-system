// "use client";

// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import { Card, CardContent } from "@repo/ui/components/card";
// import {
//   ArrowLeftIcon,
//   BookmarkIcon,
//   CalendarIcon,
//   ClockIcon,
//   HeartIcon,
//   ShareIcon,
//   UserIcon,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useState } from "react";
// import { useGetArticles } from "../use-get-article";

// export default function ArticleDetailPage() {
//   const params = useParams();
//   const articleId = params?.id as string;
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);

//   // Fetch all articles and find the one with the matching id
//   const { data, isLoading, error } = useGetArticles({ limit: 100 });
//   const article = data?.data?.find((a) => a.id === articleId);

//   const handleShare = () => {
//     if (navigator.share && article) {
//       navigator.share({
//         title: article.title,
//         text: article.excerpt,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//     }
//   };

//   const handleBookmark = () => {
//     setIsBookmarked(!isBookmarked);
//   };

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
//         <div className="container mx-auto px-4 py-12 max-w-4xl">
//           <div className="animate-pulse space-y-8">
//             {/* Navigation skeleton */}
//             <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>

//             {/* Hero skeleton */}
//             <div className="space-y-6">
//               <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
//               <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
//               <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
//             </div>

//             {/* Content skeleton */}
//             <div className="space-y-4 max-w-3xl mx-auto">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !article) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
//         <div className="text-center p-8">
//           <div className="text-8xl mb-6">🔍</div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
//             Article Not Found
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
//             The article you're looking for doesn't exist or may have been moved.
//           </p>
//           <Link href="/articles">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//             >
//               <ArrowLeftIcon className="w-5 h-5 mr-2" />
//               Back to Articles
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
//       {/* Floating Navigation */}
//       <nav className="fixed top-6 left-6 z-50">
//         <Link href="/article">
//           <Button
//             variant="outline"
//             size="sm"
//             className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             <ArrowLeftIcon className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </Link>
//       </nav>

//       {/* Floating Action Buttons */}
//       <div className="fixed top-6 right-6 z-50 flex space-x-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleShare}
//           className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <ShareIcon className="w-4 h-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleBookmark}
//           className={`backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
//             isBookmarked
//               ? "bg-blue-600 text-white hover:bg-blue-700"
//               : "bg-white/80 dark:bg-gray-800/80"
//           }`}
//         >
//           <BookmarkIcon className="w-4 h-4" />
//         </Button>
//       </div>

//       <div className="container mx-auto px-4 py-16 max-w-4xl">
//         {/* Article Header */}
//         <header className="text-center mb-12">
//           {article.category && (
//             <Badge
//               variant="secondary"
//               className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-0"
//             >
//               {article.category}
//             </Badge>
//           )}

//           <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-8 leading-tight">
//             {article.title}
//           </h1>

//           {article.excerpt && (
//             <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
//               {article.excerpt}
//             </p>
//           )}

//           {/* Article Meta */}
//           <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
//             {article.author && (
//               <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-full">
//                 <UserIcon className="w-4 h-4 mr-2" />
//                 <span className="font-medium">{article.author}</span>
//               </div>
//             )}

//             <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-full">
//               <CalendarIcon className="w-4 h-4 mr-2" />
//               <time dateTime={article.createdAt}>
//                 {new Date(article.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </time>
//             </div>

//             {article.readTime && (
//               <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-full">
//                 <ClockIcon className="w-4 h-4 mr-2" />
//                 <span>{article.readTime} min read</span>
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Featured Image */}
//         {article.featuredImage && (
//           <div className="relative h-96 md:h-[32rem] w-full mb-16 rounded-3xl overflow-hidden shadow-2xl">
//             <Image
//               src={article.featuredImage}
//               alt={article.title}
//               fill
//               className="object-cover"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
//           </div>
//         )}

//         {/* Article Content */}
//         <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl mb-12">
//           <CardContent className="p-8 md:p-12">
//             <div className="prose prose-lg dark:prose-invert max-w-none">
//               {article.content ? (
//                 <div
//                   dangerouslySetInnerHTML={{ __html: article.content }}
//                   className="text-gray-700 dark:text-gray-300 leading-relaxed"
//                 />
//               ) : (
//                 <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
//                   <p className="text-xl font-light leading-relaxed text-gray-800 dark:text-gray-200 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
//                     This is where the full article content would be beautifully
//                     displayed. The content would come from your backend API and
//                     could include rich text formatting, images, and other media
//                     elements.
//                   </p>
//                   <p>
//                     The article layout is designed to be highly readable and
//                     engaging, with proper typography, generous spacing, and
//                     responsive design that works seamlessly across all devices.
//                     The glassmorphism effect adds a modern, premium feel to the
//                     reading experience.
//                   </p>
//                   <p>
//                     You can customize this section to match your content
//                     structure and styling preferences while maintaining the
//                     clean, sophisticated aesthetic that makes reading a
//                     pleasure.
//                   </p>
//                   <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-r-lg">
//                     <p className="text-blue-800 dark:text-blue-200 font-medium italic">
//                       "Great design is not just what it looks like and feels
//                       like. Great design is how it works."
//                     </p>
//                     <footer className="text-sm text-blue-600 dark:text-blue-400 mt-2">
//                       — Steve Jobs
//                     </footer>
//                   </blockquote>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Article Actions */}
//         <div className="flex items-center justify-center space-x-4 mb-12">
//           <Button
//             variant="outline"
//             onClick={handleLike}
//             className={`transition-all duration-300 ${
//               isLiked
//                 ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
//                 : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/20"
//             }`}
//           >
//             <HeartIcon
//               className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
//             />
//             {isLiked ? "Liked" : "Like"}
//           </Button>

//           {/* <Button
//             variant="outline"
//             className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20"
//           >
//             <MessageCircleIcon className="w-4 h-4 mr-2" />
//             Comment
//           </Button> */}
//         </div>

//         {/* Tags */}
//         {article.tags && article.tags.length > 0 && (
//           <div className="text-center mb-12">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Related Topics
//             </h3>
//             <div className="flex flex-wrap justify-center gap-2">
//               {article.tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant="outline"
//                   className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
//                 >
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Back to Articles */}
//         <div className="text-center">
//           <Link href="/article">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <ArrowLeftIcon className="w-5 h-5 mr-2" />
//               Explore More Articles
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  ShareIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetArticles } from "../use-get-article";

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch all articles and find the one with the matching id
  const { data, isLoading, error } = useGetArticles({ limit: 100 });
  const article = data?.data?.find((a) => a.id === articleId);

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            {/* Navigation skeleton */}
            <div className="h-6 bg-gray-200 rounded w-32"></div>

            {/* Hero skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-16 bg-gray-200 rounded w-3/4"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 max-w-3xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-8xl mb-6">🗺️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <Link href="/articles">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/article">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-teal-600"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
            </Link>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-600 hover:text-teal-600"
              >
                <ShareIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${isBookmarked ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {article.featuredImage && (
        <div className="relative h-[60vh] w-full">
          <Image
            src={article.featuredImage || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Hero content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12 max-w-4xl">
              {article.category && (
                <Badge className="mb-4 bg-teal-600 text-white border-0 text-sm font-medium">
                  {article.category}
                </Badge>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight text-balance">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-white/90 mb-6 leading-relaxed max-w-3xl text-pretty">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {article.author && (
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-teal-600" />
                <span className="font-medium text-gray-900">
                  By {article.author}
                </span>
              </div>
            )}

            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-teal-600" />
              <time dateTime={article.createdAt}>
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {article.readTime && (
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-teal-600" />
                <span>{article.readTime} min read</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg prose-gray max-w-none">
          {article.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-gray-800 leading-relaxed"
            />
          ) : (
            <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
              <p className="text-xl font-light leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:text-teal-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                This is where the full article content would be beautifully
                displayed. The content would come from your backend API and
                could include rich text formatting, images, and other media
                elements.
              </p>
              <p>
                The article layout follows Lonely Planet's clean editorial
                style, with excellent readability, generous white space, and a
                focus on the content itself. The design prioritizes the reading
                experience while maintaining visual appeal.
              </p>
              <p>
                Travel stories deserve a layout that lets the content breathe
                and allows readers to immerse themselves in the narrative
                without distractions.
              </p>
              <blockquote className="border-l-4 border-teal-500 pl-6 py-4 bg-teal-50 rounded-r">
                <p className="text-teal-800 font-medium italic">
                  "Travel makes one modest. You see what a tiny place you occupy
                  in the world."
                </p>
                <footer className="text-sm text-teal-600 mt-2">
                  — Gustave Flaubert
                </footer>
              </blockquote>
            </div>
          )}
        </article>

        <div className="flex items-center justify-start space-x-4 mt-12 pt-8 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleLike}
            className={`transition-all duration-300 ${
              isLiked
                ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                : "border-gray-300 hover:border-red-300 hover:text-red-600"
            }`}
          >
            <HeartIcon
              className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
            />
            {isLiked ? "Liked" : "Like this article"}
          </Button>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/article">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Explore More Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
