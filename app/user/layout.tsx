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
          <TopNav/>
          <SidebarProvider>

          <main className="flex-1 ">
            <TooltipProvider>
               <Header />
              <div className="flex container mx-auto">
                
                <JobSidebar />
                <div className="flex-1 p-2  ">
                {children}
                </div>
                </div>
              <Toaster position="top-center" richColors />
            </TooltipProvider>
          </main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
