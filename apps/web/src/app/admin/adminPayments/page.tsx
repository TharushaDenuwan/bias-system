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

import AdminReceivedPaymentListing from "@/features/admin/adminPayment-management/components/adminReceivedPayment-listing";
import { CreateAdminPayment } from "@/features/admin/booking-management/components/admin-payments/components/create-adminPayment/create-adminPayment";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function AdminPaymentManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Admin Payments"
          description="Manage all admin payments and transactions on the platform"
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

        {/* Admin Payments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Admin Payments
              </h2>
              <p className="text-sm text-gray-600">
                View and manage all admin payments and transactions
              </p>
            </div>
          </div>

          <AdminReceivedPaymentListing />
        </div>
      </div>
    </PageContainer>
  );
}
