// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@repo/ui/components/card";
// import { CalendarIcon } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { type Article } from "../use-get-article";

// interface ArticleCardProps {
//   article: Article;
// }

// export function ArticleCard({ article }: ArticleCardProps) {
//   return (
//     <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className="p-0">
//         {article.featuredImage && (
//           <div className="relative h-48 w-full">
//             <Image
//               src={article.featuredImage}
//               alt={article.title}
//               fill
//               className="object-cover rounded-t-lg"
//             />
//           </div>
//         )}
//       </CardHeader>
//       <CardContent className="flex-1 p-6">
//         <h2 className="text-2xl font-semibold mb-2 line-clamp-2">
//           {article.title}
//         </h2>
//         {article.excerpt && (
//           <p className="text-muted-foreground line-clamp-3 mb-4">
//             {article.excerpt}
//           </p>
//         )}
//         <div className="flex items-center text-sm text-muted-foreground">
//           <CalendarIcon className="w-4 h-4 mr-2" />
//           <time dateTime={article.createdAt}>
//             {new Date(article.createdAt).toLocaleDateString()}
//           </time>
//         </div>
//       </CardContent>
//       <CardFooter className="p-6 pt-0">
//         <Link href={`/article/${article.slug}`} className="w-full">
//           <Button variant="outline" className="w-full">
//             Read More
//           </Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Article } from "../use-get-article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`} className="group block h-full">
      <Card className="group flex flex-col h-full bg-white dark:bg-gray-900 border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        <CardHeader className="p-0 relative">
          {article.featuredImage && (
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
            <time dateTime={article.createdAt}>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            variant="outline"
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/20 dark:group-hover:border-blue-800 transition-colors duration-200"
            tabIndex={-1}
          >
            Read More
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
