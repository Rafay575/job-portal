"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
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
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
