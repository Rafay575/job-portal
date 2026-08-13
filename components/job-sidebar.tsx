"use client";

import {
  CheckCircle2,
  Bookmark,
  AlertCircle,
  Heart,
  FileText,
  FileText as FileCheck,
  Settings,
  User,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Label } from "./ui/label";
import { FaSearchDollar } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { IoBookmarkOutline, IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import ProfileCompletion from "./ProfileCompletion";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
const activitySections = [
  { label: "My Jobs", icon: IoBookmarkOutline, href: "/jobs/my-jobs" },
  { label: "Browse Jobs", icon: IoSearchOutline, href: "/jobs" },
];

export function JobSidebar({ roleType, setRoleType, step, className }: any) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { open } = useSidebar();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  return (
    <>
      <Sidebar collapsible="icon" className="border-slate-200 ">
        <SidebarHeader className="mb-[10px]  ">
          {open ? (
            <div className="flex justify-between">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={67}
                className="w-[70%] "
                unoptimized
                onClick={() => router.push("/")}
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
              onClick={() => {
                toggleSidebar();
              }}
            />
          )}
        </SidebarHeader>
        <SidebarContent className="p-4">
          {/* Role Section */}
          <div
            className={`${open ? "flex" : "hidden"}  flex-col items-start gap-1 mb-3 w-full py-2`}
          >
            <h3 className=" text-lg! font-semibold text-foreground mb-2">
              Choose Role{" "}
            </h3>
            <div className="flex flex-col  gap-1 w-full pl-1  md:pl-3">
              {/* permanent */}
              <Button
                type="button"
                onClick={() => setRoleType("permanent")}
                className={`flex-1 py-1 border rounded transition-all cursor-pointer
                ${
                  roleType === "permanent"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-foreground hover:text-white"
                }`}
              >
                Permanent
              </Button>

              {/* agency-work */}
              <Button
                type="button"
                onClick={() => setRoleType("agency-work")}
                className={`flex-1 py-1 border rounded transition-all cursor-pointer
                ${
                  roleType === "agency-work"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground  border-foreground hover:text-white"
                }`}
              >
                Agency Work
              </Button>

              {/* Both */}
              <Button
                type="button"
                onClick={() => setRoleType("both")}
                className={`flex-1 py-1 border rounded transition-all cursor-pointer
                ${
                  roleType === "both"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-foreground hover:text-white"
                }`}
              >
                Both
              </Button>
            </div>
          </div>
          {/* Activity Section */}
          <div
            className={`${open ? "" : "hidden"} space-y-3 border-t border-border pt-4`}
          >
            <h3 className="text-lg! font-semibold text-foreground">Activity</h3>
            <nav className="space-y-2 pl-1  md:pl-3">
              {activitySections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    href={section.href}
                    key={section.label}
                    className="w-full"
                  >
                    <button
                      key={section.label}
                      onClick={() => setActiveSection(section.label)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg  py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                        activeSection === section.label
                          ? "bg-primary/10 text-primary"
                          : "text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{section.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SidebarContent>
        <SidebarFooter className={`${open ? "" : "hidden"} p-2 mb-4`}>
          <ProfileCompletion step={step} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
