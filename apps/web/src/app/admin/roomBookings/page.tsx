"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateAdminPayment } from "@/features/admin/booking-management/components/admin-payments/components/create-adminPayment/create-adminPayment";
import RoomBookingsListing from "@/features/admin/booking-management/components/roomBookings-listing";
import { RoomBookingsTableActions } from "@/features/admin/booking-management/components/roomBookings-table/roomBookings-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage All RoomBookings"
          description={`Manage all roomBookings listed on the platform`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Admin Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Admin Payment Record</DialogTitle>
                </DialogHeader>
                <CreateAdminPayment onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <Separator />

        <RoomBookingsTableActions />

        <RoomBookingsListing />
      </div>
    </PageContainer>
  );
}
