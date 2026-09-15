import { Separator } from "@repo/ui/components/separator";

import { PropertyClassTableActions } from "@/features/admin/property-class-management/components/propertyClass-table/propertyClasses-table-actions";
import PropertyClasssListing from "@/features/admin/property-class-management/components/propertyClasses-listing";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function PropertyClassManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage All PropertyClasss"
          description={`Manage all propertyClasss listed on the platform`}
          actionComponent={<></>}
        />

        <Separator />

        <PropertyClassTableActions />

        <PropertyClasssListing />
      </div>
    </PageContainer>
  );
}
