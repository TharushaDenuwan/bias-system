import { HotelTabBar } from "@/features/hotels/components/hotel-tab-bar";
import { getClient } from "@/lib/rpc/server";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@repo/ui/components/separator";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default async function HotelManagementLayout({ children }: Props) {
  const rpcClient = await getClient();

  const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

  if (!myHotelRes.ok) {
    const isNotFound = myHotelRes.status === 404;

    if (isNotFound) redirect("/account/setup");

    return <></>;
  }

  const myHotel = await myHotelRes.json();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={myHotel.name}
          description={
            myHotel.description?.slice(0, 70) + "..." ||
            `You are managing your property: ${myHotel.name}`
          }
          actionComponent={<></>}
        />

        <div className="">
          <Separator />

          <HotelTabBar />

          <Separator />
        </div>

        {children}
      </div>
    </PageContainer>
  );
}
