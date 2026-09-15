"use client";

import { CreateDestination } from "@/features/admin/property-type/components/create-new-destination";
import { DestinationList } from "@/features/admin/property-type/components/destination-list";
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
            title="Manage Home Sections"
            description="Manage all home sections listed on the platform"
            actionComponent={""}
          />
          {/* Top right button to open popup */}
          <div>
            <CreateDestination triggerRef={triggerRef} />
          </div>
        </div>

        <Separator />

        <DestinationList />
      </div>
    </PageContainer>
  );
}
