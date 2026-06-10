"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { RootState } from "@/lib/store";

export default function DashboardCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      router.replace("/auth/login");
      return;
    }

    if (user?.role === "admin") {
      toast.error("Not authorized");
      router.replace("/");
      return;
    }
  }, [user, router]);

  // while checking auth / redirecting
  if (!user || user?.role === "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}