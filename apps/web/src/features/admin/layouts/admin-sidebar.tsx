"use client";

import { IconBuildings, IconUsers } from "@tabler/icons-react";
import * as React from "react";

import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { PiBuilding } from "react-icons/pi";
import { getUserDetails } from "./get-user-details";

import { AdminSidebarNav } from "./sidebar-nav";

const data = {
  main: [
    {
      name: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      name: "Hotels",
      url: "/admin/hotels",
      icon: IconBuildings,
    },
    {
      name: "Bookings",
      url: "/admin/roomBookings",
      icon: IconBuildings,
    },
    {
      name: "payments",
      url: "/admin/adminPayments",
      icon: IconBuildings,
    },
    {
      name: "Property Class",
      url: "/admin/property-class",
      icon: IconBuildings,
    },
    {
      name: "Hotel Types",
      url: "/admin/hotel-types",
      icon: IconBuildings,
    },
    {
      name: "Article",
      url: "/admin/article-management",
      icon: IconBuildings,
    },
    {
      name: "Ads",
      url: "/admin/ad-management",
      icon: IconBuildings,
    },
    {
      name: "Home sections",
      url: "/admin/property-types",
      icon: IconBuildings,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = getUserDetails();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded">
                  <PiBuilding className="size-4" />
                </div>

                <span className="text-base font-semibold font-heading">
                  {`Bloonsoo Admin`}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminSidebarNav items={data.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
