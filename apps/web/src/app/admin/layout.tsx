import React from "react";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AdminSidebar } from "@/features/admin/layouts/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)"
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
