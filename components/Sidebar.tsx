"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";


export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Latest Jobs",
      href: "/jobs",
      icon: Briefcase,
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`h-screen border-r bg-background transition-all duration-300 flex flex-col
        ${collapsed ? "w-[70px]" : "w-[200px]  lg:w-[240px]"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4">
          {/* Logo */}
          {!collapsed && (
            <Image src="/logo.png" alt="logo" width={120} height={40} />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                collapsed && "rotate-180"
              }`}
            />
          </Button>
        </div>

        <Separator />

        {/* Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Tooltip key={link.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className="flex items-center  gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
                  >
                    <Icon className="h-5 w-5 " />

                    {!collapsed && (
                      <span className="text-sm font-medium ">{link.name}</span>
                    )}
                  </Link>
                </TooltipTrigger>

                {collapsed && (
                  <TooltipContent side="right">{link.name}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-3 space-y-2">
          {/* Logout */}
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Link href={"/auth/login"} className="flex  gap-3 items-center">
              <LogOut className="h-4 w-4 text-red-800" />
              {!collapsed && <span className="text-red-800">Logout </span>}
            </Link>
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
