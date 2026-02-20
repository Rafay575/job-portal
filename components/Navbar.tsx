"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Jobs", href: "/jobs" },
  { name: "Blog", href: "/blogs" },
];

export default function Navbar() {
  return (
    <header className="border-b sticky top-0 left-0 bg-white z-50">
      <div className=" px-4 py-2 flex items-center justify-between relative">
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

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8 text-md">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className=" font-medium ">
              <div className="flex items-center gap-1">
                <p>{link.name}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="inline-flex rounded-full border  bg-white ">
            {/* Left button: outlined/ghost */}
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 border-0 shadow-none bg-white hover:bg-white"
            >
              Post a Job
            </Button>

            {/* Right button: filled/primary */}
            <Link href={"/auth/register"}>
              <Button className="rounded-full px-6 py-2">Register a CV</Button>
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

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Menu className="lg:hidden text-2xl text-primary" />
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px] px-2 py-4 gap-1">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-primary font-medium text-center"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary mt-2"
            >
              Recruiting? Post a Job
            </Button>
            <Button className="bg-primary">Register a CV</Button>
            <Button variant="outline" className="bg-primary ">
              Sign in
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
