"use client";

import "./globals.css";
// import Sidebar from "@/components/Sidebar";

import Header from "@/components/Header";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

import QueryProvider from "@/providers/QueryProvider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideSidebar = pathname.startsWith("/auth");


  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/user");


  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <QueryProvider>
          <TooltipProvider>
            {!isAdminRoute && (
              <>
                <TopNav />
                <Navbar />
              </>
            )}
            {children}
            {!isAdminRoute && (
              <>
                <Footer />
              </>
            )}

            {/* Change position: top-right, top-left, bottom-right, bottom-left, top-center, bottom-center */}
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </QueryProvider>

      </body>
    </html>
  );
}
