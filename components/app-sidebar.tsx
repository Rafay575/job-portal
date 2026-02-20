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
<<<<<<< HEAD
=======
  SidebarTrigger,
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import SidebarLinks from "./sidebar-links";
import { HiOutlineUserGroup } from "react-icons/hi2";
const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
const links = [
  {
    name: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    name: "Users",
    url: "/users",
    icon: HiOutlineUserGroup,
  }
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mb-[10px]">
        {open ? (
<<<<<<< HEAD
=======
          <div className="flex justify-between">
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-[70%] "
            unoptimized
          />
<<<<<<< HEAD
=======
          <SidebarTrigger className="text-[10px] block md:hidden" />
          </div>
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
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
