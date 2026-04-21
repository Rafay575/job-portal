"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
                  <div className="flex-1 p-2">{children}</div>
                </div>
              </TooltipProvider>
            </div>
          </SidebarProvider>
        </div>
     
    </div>
  );
}
