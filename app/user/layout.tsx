"use client";
import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JobSidebar } from "@/components/job-sidebar";
import DashboardCheck from "@/components/DashboardCheck";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/lib/provider";
import Providers from "@/components/Providers";

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
              {/* <Header /> */}
              {/* <Navbar/> */}
              <div className="flex mx-auto items-start ">
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
