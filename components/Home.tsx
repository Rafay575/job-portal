// app/page.tsx (Homepage)
"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaHandsHoldingCircle, FaLocationDot } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import Marquee from "react-fast-marquee";
import {
  FaMapMarkedAlt,
  FaPassport,
  FaUserMd,
  FaUserNurse,
} from "react-icons/fa";
import { SiAdguard } from "react-icons/si";
import { IoFlash } from "react-icons/io5";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/lib/getJobs";
import type { Job } from "@/types/job";

export default function HomePage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();

        if (response?.success && Array.isArray(response.data)) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);
  const [counterValues, setCounterValues] = useState({
    active: 0,
    employers: 0,
    success: 0,
  });
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const counters = [
      { target: 1200, key: "active" },
      { target: 450, key: "employers" },
      { target: 99, key: "success" },
    ];
    const duration = 2000;
    const startTimes = [0, 100, 200];

    counters.forEach((counter, index) => {
      const startTime = Date.now() + startTimes[index];
      const step = counter.target / (duration / 16);

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(updateCounter);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * counter.target);
        setCounterValues((prev) => ({
          ...prev,
          [counter.key]: current,
        }));
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCounterValues((prev) => ({
            ...prev,
            [counter.key]: counter.target,
          }));
        }
      };
      requestAnimationFrame(updateCounter);
    });
  }, []);

  const regions = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.region?.trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const performSearch = () => {
    const params = new URLSearchParams();

    const search = searchTerm.trim();
    const region = location.trim();

    if (search) {
      params.set("search", search);
    }

    if (region) {
      params.set("region", region);
    }

    const queryString = params.toString();

    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };
  // Trusted companies list
  const trustedCompanies = [
    "Spire Healthcare",
    "Bupa",
    "HCA Healthcare",
    "Nuffield Health",
    "Circle Health",
    "Ramsay Health",
    "The London Clinic",
    "Cleveland Clinic",
  ];
  return (
    <div className="bg-[#F8FAFC]  dark:bg-slate-900">
      {/* Hero Section */}
      <header className="hero-gradient text-white py-28 lg:py-40 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient((--var(--primary))_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center py-2 px-5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20! mb-8 text-purple-200"
          >
            <i className="fa-solid fa-award mr-2 text-yellow-400"></i>
            🌻 The Premier UK Medical Talent Ecosystem
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="text-4xl! sm:text-6xl! lg:text-6xl! font-extrabold tracking-tight leading-tight mb-8"
          >
            Accelerating Careers in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
              UK Healthcare
            </span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="text-lg! sm:text-xl! text-purple-100 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
          >
            Hayaibu Talent delivers enterprise-grade recruitment infrastructure,
            seamlessly connecting specialist doctors, registered clinical
            nurses, and dedicated healthcare assistants with premier private
            medical groups, hospitals, and specialized clinics across England,
            Scotland, Wales, and Northern Ireland.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-3xl border border-white/20! bg-white/10 p-3 shadow-2xl backdrop-blur-2xl md:flex-row md:items-center"
          >
            {/* Search input */}
            <div className="group flex min-h-[50px] flex-1 items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-700/70 dark:bg-slate-900">
              <HiMiniMagnifyingGlass className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-focus-within:scale-110 lg:h-6 lg:w-6" />

              <input
                type="text"
                placeholder="Job title, specialty, or city..."
                className="w-full border-none! bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    performSearch();
                  }
                }}
              />
            </div>

            {/* Region selector */}
            <div className="flex min-h-[50px] w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 dark:border-slate-700/70 dark:bg-slate-900 md:w-[280px]">
              <FaLocationDot className="h-5 w-5 shrink-0 text-primary" />

              <select
                className="w-full cursor-pointer border-none bg-transparent text-base font-medium text-slate-800 outline-none focus-visible::ring-0! focus-visible:outline-0! focus-visible:border-0! dark:text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option
                  value=""
                  className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white focus:ring-0! focus:outline-0! "
                >
                  All UK Regions
                </option>

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                    className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white"
                  >
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={performSearch}
              className="group flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 md:w-auto md:min-w-[175px]"
            >
              <span>Search Jobs</span>

              <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.6,
              ease: "easeOut",
            }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center border-t border-white/10 pt-10"
          >
            <div className="group cursor-default">
              <div className="text-4xl font-extrabold text-white">
                {counterValues.active.toLocaleString()}+
              </div>
              <div className="text-xs text-purple-200 mt-2 uppercase tracking-wider font-medium">
                Active Vacancies
              </div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl font-extrabold text-white">
                {counterValues.employers.toLocaleString()}+
              </div>
              <div className="text-xs text-purple-200 mt-2 uppercase tracking-wider font-medium">
                Verified Employers
              </div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl font-extrabold text-white">
                {counterValues.success}%
              </div>
              <div className="text-xs text-purple-200 mt-2 uppercase tracking-wider font-medium">
                Placement Success
              </div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl font-extrabold text-white">24/7</div>
              <div className="text-xs text-purple-200 mt-2 uppercase tracking-wider font-medium">
                Candidate Support
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Trusted By Marquee */}
      <section className="py-8 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 ">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs! font-bold! uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            Trusted by Leading UK Healthcare Providers
          </p>
          <Marquee
            gradient={true}
            gradientColor="#f1f5f9" // slate-100 as hex string
            speed={30}
            pauseOnHover={true}
            className="py-2 overflow-hidden"
          >
            {trustedCompanies.map((name, i) => (
              <span
                key={i}
                className="mx-12 text-xl! font-bold text-slate-400! dark:text-slate-300 hover:text-primary! transition cursor-default whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Enterprise Feature Grid */}
      <section className=" py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary dark:text-primary font-bold! uppercase tracking-widest text-xs! mb-3 block">
            Comprehensive Medical Specialisms
          </span>
          <h2 className="text-3xl! sm:text-5xl! font-extrabold! text-[#1E293B] tracking-tight mb-6">
            Explore Opportunities by Healthcare Sector
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg!">
            Designed for clinical excellence. Discover targeted roles structured
            around your medical qualifications and professional aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Doctors */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100! dark:border-slate-700 hover:-translate-y-3 transition duration-500 group card-3d">
            <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80"
                alt="Doctor Jobs UK"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                Clinical Leadership
              </span>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <FaUserMd className="text-white! text-sm" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition  group-hover:text-primary">
              Doctor &amp; Specialist Positions
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Access consulting, general practice, and specialized surgical
              openings across premier private hospital networks and specialized
              clinics. From Consultant Cardiologists to Orthopaedic Surgeons.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                240+ Active Roles
              </span>
            </div>
          </div>

          {/* Card 2 - Nurses */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100! dark:border-slate-700 hover:-translate-y-3 transition duration-500 group card-3d">
            <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                alt="Registered Nurse Jobs UK"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                Nursing Excellence
              </span>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <FaUserNurse className="text-white! text-sm" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
              Registered Nurse Vacancies
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Permanent, temporary, and specialized nursing positions across
              top-tier residential medical care centers, ICUs, and private
              wards. Band 5 through Band 7 roles available nationwide.
            </p>
            <div className="flex items-center justify-between ">
              <span className="text-xs text-slate-400 font-medium">
                580+ Active Roles
              </span>
            </div>
          </div>

          {/* Card 3 - Healthcare Assistants */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100! dark:border-slate-700 hover:-translate-y-3 transition duration-500 group card-3d">
            <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare Assistant Jobs UK"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                Support &amp; Care
              </span>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <FaHandsHoldingCircle className="text-white! text-sm" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition">
              Healthcare Assistants &amp; Care
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Dedicated care worker and support roles within premier residential
              care facilities, specialized domiciliary care, and private
              hospitals. Full training and career progression pathways provided.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                380+ Active Roles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Hayaibu Talent Section */}
      <section className="bg-slate-900 text-white py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#4c1d95_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#312e81_0%,transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#A78BFA]! font-bold uppercase tracking-widest text-xs mb-3 block">
              Enterprise Advantages
            </span>
            <h2 className="text-3xl! sm:text-5xl! font-extrabold tracking-tight mb-6">
              Why Healthcare Leaders Choose Hayaibu Talent
            </h2>
            <p className="text-slate-400 text-lg!">
              We combine cutting-edge recruitment technology with rigorous
              compliance standards to deliver unparalleled hiring outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-8 rounded-2xl hover:bg-white/10 transition duration-500 group">
              <div className="w-14 h-14 bg-primary/30 text-[#A78BFA] rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                <SiAdguard />
              </div>
              <h3 className="text-xl! font-bold mb-3">Verified Employers</h3>
              <p className="text-slate-400 text-sm! leading-relaxed">
                Every vacancy is rigorously screened against compliance,
                professional accreditation, and workplace standards. We verify
                CQC ratings and employer credentials.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:bg-white/10 transition duration-500 group">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                <FaMapMarkedAlt />
              </div>
              <h3 className="text-xl! font-bold mb-3">UK-Wide Network</h3>
              <p className="text-slate-400 text-sm! leading-relaxed">
                Extensive medical coverage across England, Scotland, Wales, and
                Northern Ireland regional centers. Local expertise with national
                reach.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:bg-white/10 transition duration-500 group">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                <IoFlash />
              </div>
              <h3 className="text-xl! font-bold mb-3">AI-Powered Matching</h3>
              <p className="text-slate-400 text-sm! leading-relaxed">
                Create your profile once and instantly apply to multiple
                positions with automated credential verification and intelligent
                job matching.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:bg-white/10 transition duration-500 group">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                <FaPassport />
              </div>
              <h3 className="text-xl! font-bold mb-3">Registration Support</h3>
              <p className="text-slate-400 text-sm! leading-relaxed">
                Dedicated advisory on GMC/NMC professional registration,
                right-to-work, visa sponsorship, and onboarding compliance for
                international candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary dark:text-primary font-bold! uppercase tracking-widest text-xs mb-3 block">
            Simple Process
          </span>
          <h2 className="text-! sm:text-5xl! text-[#1E293B] font-extrabold tracking-tight mb-6">
            Your Journey to a New Role
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg!">
            Four simple steps to your next healthcare career opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-primary  rand-500 via-primary to-primary z-1"></div>

          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white text-3xl! font-bold shadow-lg shadow-primary/30 mb-6 relative z-10">
              1
            </div>
            <h3 className="text-xl! font-bold text-center mb-3 text-slate-900 dark:text-white">
              Create Profile
            </h3>
            <p className="text-slate-600! dark:text-slate-400 text-sm! text-center leading-relaxed">
              Build your professional profile with qualifications, experience,
              and preferences. Upload your CV and certifications.
            </p>
          </div>

          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white text-3xl! font-bold shadow-lg shadow-primary/30 mb-6 relative z-10">
              2
            </div>
            <h3 className="text-xl! font-bold text-center mb-3 text-slate-900 dark:text-white">
              Get Matched
            </h3>
            <p className="text-slate-600! dark:text-slate-400 text-sm! text-center leading-relaxed">
              Our AI algorithm matches your profile with suitable vacancies
              based on skills, location, and career goals.
            </p>
          </div>

          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white text-3xl! font-bold shadow-lg shadow-primary/30 mb-6 relative z-10">
              3
            </div>
            <h3 className="text-xl! font-bold text-center mb-3 text-slate-900 dark:text-white">
              Apply Instantly
            </h3>
            <p className="text-slate-600! dark:text-slate-400 text-sm! text-center leading-relaxed">
              One-click applications to multiple roles. Track your application
              status in real-time through your dashboard.
            </p>
          </div>

          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white text-3xl! font-bold shadow-lg shadow-primary/30 mb-6 relative z-10">
              4
            </div>
            <h3 className="text-xl! font-bold text-center mb-3 text-slate-900 dark:text-white">
              Start Your Role
            </h3>
            <p className="text-slate-600! dark:text-slate-400 text-sm! text-center leading-relaxed">
              Receive interview invitations, negotiate offers, and onboard with
              dedicated support from our recruitment team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
