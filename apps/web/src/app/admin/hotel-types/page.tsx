import { Separator } from "@repo/ui/components/separator";

import { HotelTypesTableActions } from "@/features/admin/hotel-types-management/components/hotel-types-table/hotelTypes-table-actions";
import HotelTypesListing from "@/features/admin/hotel-types-management/components/hotels-listing";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function HotelTypesManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage All Hotel Types"
          description={`Manage all hotel types listed on the platform`}
          actionComponent={<></>}
        />

        <Separator />

        <HotelTypesTableActions />

        <HotelTypesListing />
      </div>
    </PageContainer>
  );
}
