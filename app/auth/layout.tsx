"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import AuthBG from "@/components/AuthBG";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Navbar from "@/components/Navbar";
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
  const direction = pathname.includes("signup") ? 1 : -1;

  return (
    <html lang="en">
      <body>
          <>
            <TopNav />
            <Navbar />
          </>
       

          {children}
        
      </body>
    </html>
  );
}
