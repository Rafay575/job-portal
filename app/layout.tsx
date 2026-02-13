"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Sidebar from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
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
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
