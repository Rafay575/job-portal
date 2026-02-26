"use client";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { Home, User, Settings } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import SidebarLinks from "./sidebar-links";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { VscGraph } from "react-icons/vsc";

const links = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
    icon: VscGraph  ,
  },
  {
    name: "Compliance",
    url: "/admin/compliance",
    icon: HiOutlineUserGroup,
  }
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props} className="border-slate-200">
      <SidebarHeader className="mb-[10px]">
        {open ? (
          <div className="flex justify-between">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={67}
            className="w-[70%] "
            unoptimized
          />
          <SidebarTrigger className="text-[10px] block md:hidden" />
          </div>
        ) : (
          // Collapsed → Icon only
           <Image
            src="/logo2.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-full "
            unoptimized
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <SidebarLinks links={links} />
      </SidebarContent>
      <SidebarFooter>{/* Footer  */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
