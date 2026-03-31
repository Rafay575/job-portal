"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
// import Sidebar from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/TopNav";
import { JobSidebar } from "@/components/job-sidebar";
import AdminHeader from "@/components/AdminHeader";

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
    <html lang="en">
     
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="">
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar />
              <div className="flex-1  ">
                <AdminHeader />
                {children}
              </div>
              <Toaster position="top-center" richColors />
            </TooltipProvider>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
