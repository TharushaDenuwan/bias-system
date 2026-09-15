"use client";

import { ArticleList } from "@/features/admin/article-management/components/article-list";
import { CreateArticle } from "@/features/admin/article-management/components/create-new-article";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@repo/ui/components/separator";
import { useRef } from "react";

export default function ArticleManagementPage() {
  // Ref to trigger the dialog from the button
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <AppPageShell
            title="Manage All Articles"
            description="Manage all articles published on the platform"
            actionComponent={""}
          />
          {/* Top right button to open popup */}
          <div>
            <CreateArticle triggerRef={triggerRef} />
          </div>
        </div>

        <Separator />

        <ArticleList />
      </div>
    </PageContainer>
  );
}
