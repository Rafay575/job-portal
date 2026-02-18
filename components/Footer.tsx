"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mar !mb-0">
      <div className="container mx-auto  pad !pb-2">

        {/* Newsletter Card */}
        <div className=" border border-white rounded-2xl px-3  py-7 md:px-6 md:py-10 flex flex-col md:flex-row  md:items-center gap-6 shadow-xl">
          <div className="flex items-center gap-4 transition-width duration-500  w-[40%] md:w-[30%] lg:w-[20%]">
            <Image src="/logo-white.png" alt="logo" width={380} height={380} className="w-full md:border-r pr-3"  unoptimized/>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-semibold">
              Subscribe to Our Newsletter
            </h3>
            <p className=" text-white/80 mt-1 ">
              Stay updated with the latest job opportunities, career tips, and more
            </p>
            <div className="flex w-full md:w-auto gap-3 mt-3">
            <Input
              placeholder="Enter Your Email Address"
              className="bg-white text-black rounded-full text-sm" 
            />
            <Button className="rounded-full border border-white text-white">
              Subscribe Now
            </Button>
          </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-10 mt-16 ">

          {[
            { title: "JOBS", links: ["Job Search", "Work From Home", "Popular Searches", "Browse Locations"] },
            { title: "RECRUITER", links: ["Job Search", "Work From Home", "Popular Searches", "Browse Locations"] },
            { title: "CAREER ADVICE", links: ["Job Search", "Work From Home", "Popular Searches", "Browse Locations"] },
            { title: "CAREER ADVICE", links: ["Job Search", "Work From Home", "Popular Searches", "Browse Locations"] },
            { title: "RESOURCES", links: ["About Us", "Careers", "Contact Us", "Blog", "Sitemap"] },
          ].map((group, i) => (
            <div key={i}>
              <span className="font-semibold  text-[18px] border-b py-1">{group.title}</span>
              <ul className="space-y-2 text-white/80 mt-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="text-center mt-4">
          <p className="mb-4 font-medium subheading">Looking to hire? Speak to Our Team!</p>
          <Button
            variant="outline"
            className="rounded-full border-white text-white bg-primary hover:bg-white hover:text-primary cursor-pointer"
          > 
            Contact Us
          </Button>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-6 py-3 flex flex-col items-center md:flex-row justify-between text-sm text-white/80 gap-3">
          <span>2026 Hayaiibu Talent. All Rights Reserved</span>

          <div className="flex gap-4">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
