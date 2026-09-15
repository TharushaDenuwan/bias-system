import React from "react";

import { AppSidebar } from "@/components/userdashboard/app-sidebar";
import { SiteHeader } from "@/components/userdashboard/site-header";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function userDashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
