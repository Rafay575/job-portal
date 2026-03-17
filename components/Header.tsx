"use client";

import {  Settings } from "lucide-react";
import Profile from "./Profile";
import Notification from "@/components/Notification";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className=" border-b border-slate-200 bg-background flex items-center px-2 gap-[10px] justify-between sticky top-0 w-[100%] er z-[10] py-2">
      <div className="flex items-center gap-2 grow ">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 w-[30%] max-w-45"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={500}
            height={500}
            className="w-full "
            unoptimized
          />
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2  md:gap-4">
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
