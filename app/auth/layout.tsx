"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import AuthBG from "@/components/AuthBG";
import { AnimatePresence, motion } from "framer-motion";
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
      <body
      >
        <div className="relative isolate min-h-[100vh] max-w-[100vw]! overflow-x-hidden  flex items-center justify-center overflow-hidden  bg-primary py-[50px]">
          <AuthBG />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname} 
              initial={{ x: direction * 300, opacity: 0 }}  
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * 300, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full!  overflow-hidden"
            >
              {children}            
            </motion.div>
          </AnimatePresence>  
        </div>
      </body>
    </html>
  );
}
