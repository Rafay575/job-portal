"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Profile from "./Profile";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { FiSidebar } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Jobs", href: "/jobs" },
  { name: "Dashboard", href: "/user/dashboard" },
  { name: "Admin", href: "/admin/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/user/dashboard") === true;
  const user = useSelector((state: RootState) => state.user);
  return (
    <div className="border-b border-slate-200 sticky top-0 left-0 bg-white z-50">
      <div
        className={`px-4 py-2 flex items-center ${isDashboard ? "justify-end" : "justify-between"} relative`}
      >
        {/* LOGO */}
        <Link
          href="/"
          className={`${isDashboard ? "hidden" : "flex"} flex items-center gap-2 w-[30%] max-w-45`}
        >
          <div className="relative w-full aspect-[500/169]">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              sizes="1"
              loading="eager"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {isDashboard && (
          <SidebarTrigger className="mr-auto ">
            <FiSidebar
              className={` duration-500 text-[20px] lg:text-[25px]  hover:cursor-pointer text-[var(--foreground)]`}
            />
          </SidebarTrigger>
        )}

        {/* DESKTOP NAV */}
        <nav
          className={`${isDashboard ? "hidden" : "hidden lg:flex"}   items-center gap-2 text-md`}
        >
          {navLinks.map((link) => {
            if (!user.loggedIn) {
              if (link.name === "Dashboard") return false;
              if (link.name === "Admin") return false;
            }
            if (link.name === "Admin" && user?.role !== "admin") {
              return null;
            }
            if (link.name === "Dashboard" && user?.role == "admin") {
              return null;
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative font-semibold!  px-5 py-1.5 rounded-full transition hover:text-primary
             after:content-[''] after:absolute after:left-1/2 after:bottom-0
             after:h-[2px] after:w-full after:bg-primary
             after:-translate-x-1/2 after:scale-x-0
             after:origin-center
             after:transition-transform after:duration-300
             hover:after:scale-x-100"
              >
                <div className="flex items-center ">
                  <p>{link.name}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}
        {user.loggedIn == false && (
          <div className="hidden lg:flex items-center gap-3">
            <div className="inline-flex rounded-full border  bg-white ">
              {/* Left button: outlined/ghost */}

              {/* Right button: filled/primary */}
              <Link href={"/auth/register"}>
                <Button className="rounded-full px-4 py-2">
                  Register a CV
                </Button>
              </Link>
            </div>
            <Link href={"/auth/login"}>
              <Button
                variant="outline"
                className="border-primary text-primary rounded-4xl"
              >
                Sign in
              </Button>
            </Link>
          </div>
        )}
        {user.loggedIn && (
          <div className="hidden lg:block">
            <Profile />
          </div>
        )}

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <div className=" flex gap-3 item-center lg:hidden">
              {user.loggedIn && (
                <div>
                  <Profile />
                </div>
              )}
              <Menu className="text-2xl text-primary my-auto" />
            </div>
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px] px-2 py-4 gap-1">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => {
                const isLoggedIn = user?.loggedIn;
                const isAdmin = user?.role === "admin";

                // Not logged in users
                if (!isLoggedIn) {
                  if (link.name === "Dashboard" || link.name === "Admin") {
                    return null;
                  }
                }

                // Admin-only logic
                if (link.name === "Admin" && !isAdmin) {
                  return null;
                }

                // Hide Dashboard for admin (your rule)
                if (link.name === "Dashboard" && isAdmin) {
                  return null;
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-primary font-medium text-center"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            {user.loggedIn == false && (
              <>
                {/* <Button
                  variant="outline"
                  className="border-primary text-primary mt-2"
                >
                  Recruiting? Post a Job
                </Button> */}

                <Link href={"/auth/register"} className="w-full">
                  <Button className="bg-primary w-full border-none">
                    Register a CV
                  </Button>
                </Link>
                <Link href={"/auth/login"} className="w-full">
                  <Button
                    variant="outline"
                    className="bg-primary text-white w-full"
                  >
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
