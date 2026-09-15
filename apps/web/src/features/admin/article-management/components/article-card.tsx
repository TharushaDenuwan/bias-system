"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLinkIcon,
  FileTextIcon,
  LinkIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { useDeleteArticle } from "../api/use-delete-article";
import type { article } from "../schemas";

type Props = {
  article: article;
};

export function ArticleCard({ article }: Props) {
  const id = useId();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    deleteArticle(article.id, {
      onSuccess: () => {
        toast.success("Article deleted successfully");
        setShowDeleteDialog(false);
        queryClient.invalidateQueries({ queryKey: ["articles"] });
      },
      onError: () => {
        toast.error("Failed to delete article");
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-cyan-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={article.featuredImage ?? ""}
              alt={article.title}
              className="size-16"
            />
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              <FileTextIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(new Date(article.createdAt))} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {article.excerpt && (
                <span className="text-xs text-muted-foreground">
                  {article.excerpt}
                </span>
              )}
              {article.userId && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="text-sm truncate max-w-[120px]">
                      {article.userId}
                    </span>
                  </div>
                </>
              )}
              {article.slug && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{article.slug}</span>
                </>
              )}
              {article.content && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="truncate max-w-[180px]">
                    {article.content}
                  </span>
                </>
              )}
              {article.featuredImage && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-teal-500" />
                    <a
                      href={article.featuredImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline truncate max-w-[180px] text-sm"
                    >
                      {article.featuredImage}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
            >
              Published
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/admin/article-management/${article.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article "{article.title}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Article"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
