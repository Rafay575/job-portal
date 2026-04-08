"use client";
import "@/app/globals.css";
import TopNav from "@/components/TopNav";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const user = useSelector((state: RootState) => state.user);
  const navigate = useRouter();
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (hasRun.current) return;

    if (user?.loggedIn) {
      hasRun.current = true;
      toast.success("You are already logged in");
      navigate.push("/");
    }
  }, []);
  return (
    <div className="auth-layout">
      <title>Hayaibu Talent | Authentication</title>
          <>
            <TopNav />
            <Navbar />
          </>
          {children}
    </div>
  );
}
