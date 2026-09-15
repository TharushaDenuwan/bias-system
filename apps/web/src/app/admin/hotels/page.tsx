import { Separator } from "@repo/ui/components/separator";

import HotelsListing from "@/features/admin/hotel-management/components/hotels-listing";
import { HotelsTableActions } from "@/features/admin/hotel-management/components/hotels-table/hotels-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Button } from "@repo/ui/components/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

export default function HotelManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage All Hotels"
          description={`Manage all hotels listed on the platform`}
          actionComponent={
            <Button asChild variant={"outline"} icon={<PlusCircleIcon />}>
              <Link href="/admin/hotels/new">Create new Hotel</Link>
            </Button>
          }
        />

        <Separator />

        <HotelsTableActions />

        <HotelsListing />
      </div>
    </PageContainer>
  );
}
