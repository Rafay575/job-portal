"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/lib/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";


export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      await logoutUser(); // ✅ wait for API
      router.push("/auth/login"); // ✅ redirect after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const getInitials = (name?: string | null) => {
  if (!name || typeof name !== "string") {
    return "U";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};
  return (
    <div className="flex items-center gap-[5px] md:gap-[10px] z-[999] cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 rounded-full border-none  focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Avatar className="w-[35px] h-[35px]">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          {/* User Info */}
          <DropdownMenuItem className="flex gap-3 items-center">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="capitalize font-[600] color">
                {user.name || "User"}
              </p>
              <p className="text-gray-500 text-[13px]! italic">
                {user.role || ""}
              </p>
            </div>
          </DropdownMenuItem>

          {/* Links */}
          {user.role == "employee" && (
            <Link href="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
          )}

          {/* Logout */}
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
