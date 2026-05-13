"use client";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import TopNav from "@/components/TopNav";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

import QueryProvider from "@/providers/QueryProvider";
import ReduxProvider from "@/lib/provider";
import { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/user");

  return (
    <html lang="en">
      <title>Hayaibu Talent </title>
      <body className={` antialiased`}>
        <QueryProvider>
          <TooltipProvider>
            <ReduxProvider>
              <div>
                <Toaster
                  position="bottom-right"
                  reverseOrder={true}
                  toastOptions={{
                    success: {
                      icon: <CheckCircle className="size-5!" color="white" />,
                      style: {
                        background: "green",
                        color: "#fff",
                        fontSize:"14px"
                      },
                    },
                    error: {
                      icon: <XCircle className="size-5!" color="white" />,
                      style: {
                        background: "red",
                        color: "#fff",
                        fontSize:"14px"
                      },
                    },
                  }}
                />
              </div>
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
            </ReduxProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
