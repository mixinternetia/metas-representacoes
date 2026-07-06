import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6">{children ?? <Outlet />}</main>
        </SidebarInset>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
