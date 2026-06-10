"use client";
import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JobSidebar } from "@/components/job-sidebar";
import DashboardCheck from "@/components/DashboardCheck";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="users-layout">
      <title>Hayaibu Talent | Dashboard</title>
      <div className="">
        <SidebarProvider>
          <div className="flex-1 ">
            <TooltipProvider>
              <Header />
              <div className="flex container mx-auto items-start ">
                {/* <JobSidebar /> */}
                <DashboardCheck>
                  <div className="flex-1 p-2">{children}</div>
                </DashboardCheck>
              </div>
            </TooltipProvider>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
