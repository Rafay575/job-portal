"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
// import Sidebar from "@/components/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "@/components/AdminHeader";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { RootState } from "@/lib/store";

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
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      toast.error("Access denied: Admins only");
      router.replace("/");
    }
  }, [user, router]);
  return (
    <div className="dashboard-layout">
      <title>Hayaibu Talent | Admin Portal</title>
        <div className="">
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar />
              <div className="flex-1  ">
                <AdminHeader />
                {children}
              </div>
            </TooltipProvider>
          </SidebarProvider>
        </div>
    </div>
  );
}
