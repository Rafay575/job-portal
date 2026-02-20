"use client";

import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import Profile from "./Profile";
import Notification from "@/components/Notification";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center px-2 gap-[10px] justify-between sticky top-0 w-[100%] er z-[1]">
      <div className="flex items-center gap-2 grow ">
        <SidebarTrigger />
        {/* LEFT — Search */}
        <div className="relative max-w-[300px] flex grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground grow" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      {/* RIGHT */}
<<<<<<< HEAD
      <div className="flex items-center gap-4">
=======
      <div className="flex items-center gap-2  md:gap-4">
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
        {/* Settings */}
        <Settings className="h-6 w-6" />

        {/* Notifications */}
        <Notification />

        {/* Profile */}
        <Profile />
      </div>
    </header>
  );
}
