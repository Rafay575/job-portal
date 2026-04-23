"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { toast } from "react-hot-toast";

export default function AdminCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ⛔ Wait until Redux is hydrated
    if (user === undefined) return;

    if (!user || user.role !== "admin") {
      toast.error("Access denied: Admins only");
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [user, router]);

  // 🚫 Block rendering completely
  if (checking) {
    return null; // or loader
  }

  return <>{children}</>;
}