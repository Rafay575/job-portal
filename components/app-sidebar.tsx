"use client";
import * as React from "react";
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
import { GrCompliance } from "react-icons/gr";
import { VscGraph } from "react-icons/vsc";
import { PiUsers } from "react-icons/pi";
import { BsEnvelopeAt } from "react-icons/bs";
import { useRouter } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
    icon: VscGraph  ,
  },
  {
    name: "All Users",
    url: "/admin/users",
    icon: PiUsers,
  },
  {
    name: "Compliance",
    url: "/admin/compliance",
    icon: GrCompliance,
  },
  {
    name: "Email Templates",
    url: "/admin/email_template",
    icon: BsEnvelopeAt,
  }
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const router = useRouter();
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
            onClick={()=> router.push("/")}
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
            onClick={()=> router.push("/")}   
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
