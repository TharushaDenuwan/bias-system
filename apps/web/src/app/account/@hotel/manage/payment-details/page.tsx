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

import { CreateHotelPayment } from "@/features/hotel-payments/components/create-hotelPayment/create-hotelPayment";
import UserReceivedPaymentListing from "@/features/userPayment-management/components/userReceivedPayment-listing";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Payment Details"
          description={`Manage hotel payment details`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Payment Record
                </Button>
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

        <UserReceivedPaymentListing />
      </div>
    </PageContainer>
  );
}
