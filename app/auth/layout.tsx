"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import AuthBG from "@/components/AuthBG";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
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
  if (user?.loggedIn) {
    toast.success("You are already logged in");
    router.replace("/");
  }
}, [user, router]);
  return (
    <div className="auth-layout">
          <>
            <TopNav />
            <Navbar />
          </>
          {children}
    </div>
  );
}
