import { Separator } from "@repo/ui/components/separator";

import UsersListing from "@/features/admin/users-management/components/users-listing";
import { UsersTableActions } from "@/features/admin/users-management/components/users-table/users-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function UserManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage All Users"
          description={`Manage all users registered on the platform`}
          actionComponent={<></>}
        />

        <Separator />

        <UsersTableActions />

        <UsersListing />
      </div>
    </PageContainer>
  );
}
