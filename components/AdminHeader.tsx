"use client";

import { Settings } from "lucide-react";
import Profile from "./Profile";
import Notification from "@/components/Notification";
import Link from "next/link";
import Image from "next/image";
import HeaderSearchBar from "./HeaderSearchBar";
import { SidebarTrigger } from "./ui/sidebar";
import { FiSidebar } from "react-icons/fi";
export default function AdminHeader() {
  return (
    <div className="sticky top-0 right-0   py-[10px] px-[10px] md:px-[20px] bg-white shadow-b text-center border-b border-slate-200 flex justify-between items-center z-20  ">
      <SidebarTrigger>
        <FiSidebar
          className={` duration-500 text-[20px] lg:text-[25px]  hover:cursor-pointer text-[var(--foreground)]`}
        />
      </SidebarTrigger>
      <HeaderSearchBar />
      <div className="flex justify-center gap-[10px] lg:gap-[20px] items-center ">
        {/* <Notification /> */}
        <div className=" cursor-pointer">
          <Profile />
        </div>
      </div>
    </div>
  );
}

