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
  console.log(user);
  const handleLogout = async () => {
    try {
      await logoutUser(); // ✅ wait for API
      dispatch(clearUser());
      router.push("/auth/login"); // ✅ redirect after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const getInitials = (name?: string | null) => {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  const initials =
    parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[1][0];

  return initials.toUpperCase();
};

  return (
    <div className="flex items-center gap-[5px] md:gap-[10px] z-[999] cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 rounded-full border focus-visible:ring-0 focus-visible:ring-offset-0"
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
                {user.role || "user"}
              </p>
            </div>
          </DropdownMenuItem>

          {/* Links */}
          {user.role == "employee" && (
            <Link href="/user/dashboard">
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
