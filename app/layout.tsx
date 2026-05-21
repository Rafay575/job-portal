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
import AuthChecker from "@/components/AuthChecker";
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
  const isAuth = pathname.startsWith("/auth");
  return (
    <html lang="en">
      <title>Hayaibu Talent </title>
      <body className={` antialiased`}>
        <QueryProvider>
          <TooltipProvider>
            <ReduxProvider>
              {!isAuth && <AuthChecker />}

              <div>
                <Toaster
                  position="top-right"
                  containerStyle={{
                    top: 90, // 👈 pushes whole toaster down
                  }}
                  reverseOrder={true}
                  toastOptions={{
                    duration: 4000,
                    success: {
                      icon: <CheckCircle className="size-5!" color="white" />,
                      style: {
                        background: "green",
                        color: "#fff",
                        fontSize: "14px",
                      },
                    },
                    error: {
                      icon: <XCircle className="size-5!" color="white" />,
                      style: {
                        background: "red",
                        color: "#fff",
                        fontSize: "14px",
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
