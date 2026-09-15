import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import CreateHotelForm from "@/features/admin/hotel-management/components/create-hotel";
import PageContainer from "@/modules/layouts/page-container";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

export default function HotelManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="">
          <Button asChild icon={<ArrowLeftIcon />} variant={"outline"}>
            <Link href="/admin/hotels">Back to Hotels</Link>
          </Button>
        </div>

        <Separator />

        <CreateHotelForm />
      </div>
    </PageContainer>
  );
}
