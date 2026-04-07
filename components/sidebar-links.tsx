"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

type LinkItem = {
  name: string
  url: string
  icon: React.ElementType
}

export default function SidebarLinks({ links }: { links: LinkItem[] }) {
  const { open } = useSidebar()

  return (
    <SidebarMenu>
      {links.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <Link
              href={item.url}
              className={`flex items-center w-full transition-all duration-200 mx-auto ${
                open
                  ? "gap-3 justify-start px-3"
                  : "justify-center"
              }`}
            >
              <item.icon className="!h-5 !w-5 shrink-0 " />
              
              {open && <span>{item.name}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
