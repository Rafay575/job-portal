"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
// import Sidebar from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

=======
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
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
  const pathname = usePathname();
<<<<<<< HEAD
  const hideSidebar = pathname.startsWith("/auth");

=======
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/user");
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<<<<<<< HEAD
        <div className="flex">
          <SidebarProvider>
          {!hideSidebar && <AppSidebar />}
          
          <main className="flex-1 ">
            <TooltipProvider>
              {!hideSidebar && <Header />}
              <div className={`${!hideSidebar ? "p-2" : ""}`}>{children}</div>
              {/* Change position: top-right, top-left, bottom-right, bottom-left, top-center, bottom-center */}
              <Toaster position="top-center" richColors />
            </TooltipProvider>
          </main>
          </SidebarProvider>
        </div>
=======
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
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      </body>
    </html>
  );
}
