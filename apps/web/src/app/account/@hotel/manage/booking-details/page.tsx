"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import { useState } from "react";

import { CreateHotelPayment } from "@/features/hotel-payments/components/create-hotelPayment/create-hotelPayment";
import RoomBookingsListing from "@/features/userBooking-management/components/roomBookings-listing";
import { RoomBookingsTableActions } from "@/features/userBooking-management/components/roomBookings-table/roomBookings-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Booking Details"
          description={`Manage hotel booking details`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {/* <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Payment Record
                </Button> */}
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Payment Record</DialogTitle>
                </DialogHeader>
                <CreateHotelPayment onSuccess={() => setIsDialogOpen(false)} />
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
