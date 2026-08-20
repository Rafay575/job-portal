"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaClock, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-12">
        <div className="lg:col-span-1 md:col-span-2  space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer" >
            <img
              src="data:image/png;base64,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"
              alt="Hayaibu Talent Logo"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
          <p className="text-sm max-w-md leading-relaxed text-slate-400">
            The UK&apos;s trusted enterprise recruitment platform connecting specialized doctors, registered nurses, and healthcare assistants with premier private medical institutions.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition">
             <FaLinkedinIn />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition">
              <BsTwitterX />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold! uppercase text-xs! tracking-widest mb-6">Quick Navigation</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-brand-400 transition cursor-pointer">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-400 transition cursor-pointer">About Hayaibu Talent</Link>
            </li>
            <li>
              <Link href="/jobs" className="hover:text-brand-400 transition cursor-pointer">Browse All Jobs</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-400 transition cursor-pointer">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* <div>
          <h4 className="text-white font-bold! uppercase text-xs! tracking-widest mb-6">Resources</h4>
          <ul className="space-y-3 text-sm">
            <li><span className="hover:text-brand-400 transition">Career Advice</span></li>
            <li><span className="hover:text-brand-400 transition">CV Writing Tips</span></li>
            <li><span className="hover:text-brand-400 transition">Interview Preparation</span></li>
            <li><span className="hover:text-brand-400 transition">NMC Registration Guide</span></li>
            <li><span className="hover:text-brand-400 transition">GMC Registration Guide</span></li>
            <li><span className="hover:text-brand-400 transition">UK Work Visa Information</span></li>
          </ul>
        </div> */}

        <div>
          <h4 className="text-white font-bold! uppercase text-xs! tracking-widest mb-6">UK Headquarters</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FaLocationDot className="text-primary mt-1" />
              <span>128 City Road, London, EC1V 2NX, UK</span>
            </li>
            <li className="flex items-center gap-2">
              <IoMdCall className="text-primary"/>
              <span>+44 20 4620 4046</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              <span>recruitment@hayaibutalent.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FaClock className="text-primary" />
              <span>Mon-Fri: 8am - 8pm</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs! text-slate-500">
        <p>&copy; 2026 Hayaibu Talent Ltd. All rights reserved. Designed by <a href="https://allsparktechnologies.com" className="underline" target="_blank">AllSpark Technologies</a>.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-brand-400 transition">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-brand-400 transition">Terms & Conditions</Link>
          {/* <a href="#" className="hover:text-brand-400 transition">Cookie Policy</a> */}
        </div>
      </div>
    </footer>
  );
}
