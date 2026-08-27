// app/about/page.tsx (About Page)
"use client";
import Counter from "@/components/Counter";
import { useEffect, useRef, useState } from "react";
import { BsBuildingFill } from "react-icons/bs";
import { FaBriefcaseMedical, FaHeart, FaLinkedinIn, FaRocket } from "react-icons/fa";
import { FaHandshakeSimple, FaXTwitter } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { RiUserAddFill } from "react-icons/ri";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  const [counters, setCounters] = useState({
    candidates: 0,
    employers: 0,
    satisfaction: 0,
    years: 0,
  });

  useEffect(() => {
    const targets = {
      candidates: 45000,
      employers: 450,
      satisfaction: 99,
      years: 6,
    };
    const duration = 2000;

    Object.entries(targets).forEach(([key, target], index) => {
      const startTime = Date.now() + index * 150;
      const step = target / (duration / 16);

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(updateCounter);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        setCounters((prev) => ({ ...prev, [key]: current }));
        if (progress < 1) requestAnimationFrame(updateCounter);
        else setCounters((prev) => ({ ...prev, [key]: target }));
      };
      requestAnimationFrame(updateCounter);
    });
  }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-900">
      {/* Hero Banner */}
<div className="relative bg-gradient-to-br from-primary via-primary to-slate-900 py-28 px-4 sm:px-6 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#7c3aed_0%,transparent_60%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#4c1d95_0%,transparent_60%)]"></div>
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>

  <div className="max-w-5xl mx-auto text-center relative z-10">

    {/* Badge */}
    <motion.span
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="inline-flex items-center py-2 px-5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20! mb-8 text-purple-200 gap-2"
    >
      <BsBuildingFill className="text-yellow-300" />
      Corporate Profile
    </motion.span>

    {/* Heading */}
    <motion.h1
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.15,
        ease: "easeOut",
      }}
      className="text-4xl! sm:text-6xl! lg:text-7xl! font-extrabold tracking-tight mb-6 text-white"
    >
      About Hayaibu Talent
    </motion.h1>

    {/* Divider */}
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.3,
        ease: "easeOut",
      }}
      className="w-32 h-1.5 bg-gradient-to-r from-purple-400 to-purple-400 mx-auto rounded-full mb-8"
    ></motion.div>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.4,
        ease: "easeOut",
      }}
      className="text-xl! text-purple-100 max-w-3xl mx-auto leading-relaxed"
    >
      Hayaibu Talent is an advanced UK healthcare recruitment and talent
      intelligence ecosystem. We empower premier private hospital
      networks, clinics, and medical institutions by bridging the gap
      between exceptional clinical expertise and transformative healthcare
      organizations.
    </motion.p>

  </div>
</div>

      {/* Mission & Vision */}
      <div className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary dark:text-primary font-bold! uppercase tracking-widest text-xs! mb-3 block">
              Our Mission
            </span>
            <h2 className="text-3xl! sm:text-4xl! font-extrabold mb-6 text-slate-800! dark:text-white">
              Transforming Healthcare Recruitment Across the UK
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg! leading-relaxed mb-6">
              Founded in 2020, Hayaibu Talent emerged from a clear market need:
              the UK healthcare sector was struggling to fill critical roles
              efficiently. With an ageing population and increasing demand for
              private healthcare services, the need for a specialized,
              technology-driven recruitment platform became undeniable.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-lg! leading-relaxed mb-6">
              Our mission is simple yet profound: to connect exceptional
              healthcare professionals with organizations that value their
              skills, while reducing time-to-hire by 60% and improving retention
              rates by 40%. We believe that when healthcare professionals are
              matched with the right roles, patient outcomes improve, staff
              satisfaction increases, and the entire healthcare ecosystem
              benefits.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-lg! leading-relaxed">
              Unlike generalist recruitment agencies, we focus exclusively on
              the UK healthcare sector. This specialization allows us to
              understand the nuances of medical credentials, regulatory
              requirements, and the specific demands of clinical environments.
              Our team includes former healthcare professionals who bring
              firsthand understanding of the challenges faced by both employers
              and candidates.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
              alt="Hayaibu Talent Office"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5C4AD9_0%,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl text-white">
                <Counter target={45000} />
              </div>
              <div className="text-slate-300/80 text-sm mt-2 uppercase tracking-wider font-medium">
                Candidates Placed
              </div>
            </div>
            <div>
              <div className="text-5xl text-white">
                <Counter target={450} />
              </div>
              <div className="text-slate-300/80 text-sm mt-2 uppercase tracking-wider font-medium">
                Partner Employers
              </div>
            </div>
            <div>
              <div className="text-5xl text-white">
                <Counter target={99} suffix="%" />
              </div>
              <div className="text-slate-300/80 text-sm mt-2 uppercase tracking-wider font-medium">
                % Satisfaction Rate
              </div>
            </div>
            <div>
              <div className="text-5xl text-white">
                <Counter target={6} suffix="" />
              </div>
              <div className="text-slate-300/80 text-sm mt-2 uppercase tracking-wider font-medium">
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary font-bold uppercase tracking-widest text-xs! mb-3 block">
            Our Values
          </span>
          <h2 className="text-3xl! sm:text-5xl! font-extrabold tracking-tight mb-6 text-slate-800! dark:text-white">
            What Drives Us Every Day
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg!">
            Our core values shape every decision we make and every relationship
            we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200! dark:border-slate-700 shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-brand-500/30">
              <FaHeart />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Clinical Excellence
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We maintain uncompromising vetting standards to ensure every
              medical professional meets elite UK practice benchmarks. Our
              compliance team verifies every credential, registration, and
              reference before a candidate is approved.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200! dark:border-slate-700 shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-emerald-500/30">
              <FaHandshakeSimple />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Integrity &amp; Trust
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparency is at the heart of everything we do. From honest
              salary ranges to realistic job descriptions, we ensure both
              candidates and employers have complete visibility throughout the
              recruitment process.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200! dark:border-slate-700 shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-purple-500/30">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Innovation &amp; Speed
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Utilizing automated matching workflows, AI-powered candidate
              screening, and dedicated advisory support to reduce time-to-hire
              significantly. Our average placement time is just 14 days from
              application to offer.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="bg-slate-50 dark:bg-slate-900 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary dark:text-primary font-bold uppercase tracking-widest text-xs mb-3 block">
              Leadership
            </span>
            <h2 className="text-3xl! sm:text-5xl! font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
              Meet Our Leadership Team
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg!">
              Experienced professionals dedicated to transforming healthcare
              recruitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200! dark:border-slate-700 group hover:-translate-y-2 transition duration-500">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                  alt="James Richardson - CEO"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  James Richardson
                </h3>
                <p className="text-primary font-medium text-sm mb-3">
                  Chief Executive Officer
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm!">
                  Former NHS Director with 15 years of healthcare management
                  experience. MBA from London Business School.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaXTwitter />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200! dark:border-slate-700 group hover:-translate-y-2 transition duration-500">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                  alt="Dr. Emily Chen - COO"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Dr. Emily Chen
                </h3>
                <p className="text-primary font-medium text-sm mb-3">
                  Chief Operating Officer
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Former Consultant Anaesthetist with GMC registration. PhD in
                  Healthcare Management from Imperial College London.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaXTwitter />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200! dark:border-slate-700 group hover:-translate-y-2 transition duration-500">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
                  alt="Marcus Thompson - CTO"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Marcus Thompson
                </h3>
                <p className="text-primary font-medium text-sm mb-3">
                  Chief Technology Officer
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Former Principal Engineer at Google Health. MSc in Artificial
                  Intelligence from University of Edinburgh.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition"
                  >
                    <FaXTwitter />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Timeline Section */}
      {/* <div className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary font-bold uppercase tracking-widest text-xs mb-3 block">
            Our Journey
          </span>
          <h2 className="text-3xl! sm:text-5xl! font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
            The Hayaibu Talent Story
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg!">
            From a small startup to one of the UK&apos;s leading healthcare
            recruitment platforms.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary to-primary rounded-full"></div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2020
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  The Beginning
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Hayaibu Talent founded in London with a mission to solve the
                  healthcare staffing crisis. Initial focus on London and South
                  East regions.
                </p>
              </div>
              <div className="hidden md:flex w-12 h-12 bg-primary rounded-full  items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                1
              </div>
              <div className="md:w-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2"></div>
              <div className="w-12 h-12 bg-primary rounded-full hidden md:flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                2
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2021
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  Rapid Expansion
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Expanded to Manchester, Birmingham, and Edinburgh. Launched
                  our AI-powered matching algorithm, reducing placement time by
                  40%.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2022
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  Technology Investment
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Secured £5M Series A funding. Launched mobile app for
                  candidates. Introduced video interviewing and digital
                  credential verification.
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full hidden md:flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                3
              </div>
              <div className="md:w-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2"></div>
              <div className="w-12 h-12 bg-primary rounded-full hidden md:flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                4
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2023
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  UK-Wide Coverage
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Achieved coverage across all UK regions including Scotland,
                  Wales, and Northern Ireland. Reached 10,000 successful
                  placements milestone.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 md:text-right">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2024-2025
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  Industry Leadership
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Named &quot;Best Healthcare Recruitment Platform&quot; at the
                  UK Healthcare Awards. Launched international recruitment
                  division for overseas candidates.
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full hidden md:flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                5
              </div>
              <div className="md:w-1/2"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-full hidden md:flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/50 z-10">
                <TiStarFullOutline className="text-white" />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  2026
                </h3>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  The Future
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg!">
                  Continuing to innovate with AI-driven career coaching,
                  predictive analytics for workforce planning, and expanding our
                  employer network to 450+ verified partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Testimonials */}
      <div className="bg-slate-900 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl! sm:text-5xl! font-extrabold tracking-tight mb-6 text-white">
              What Our Clients Say
            </h2>
            <p className="text-slate-400 text-lg">
              Trusted by healthcare professionals and employers across the UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex text-yellow-400 mb-4">
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                &quot;Hayaibu Talent found me my dream role as a Consultant
                Cardiologist within 3 weeks. Their team understood exactly what
                I was looking for and negotiated an excellent package on my
                behalf.&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80"
                  alt="Dr. James Patterson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">Dr. James Patterson</h4>
                  <p className="text-slate-400 text-sm">
                    Consultant Cardiologist, London
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="flex text-yellow-400 mb-4">
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                &quot;As a hospital HR Director, Hayaibu Talent has reduced our
                time-to-hire by 60%. Their candidate quality is exceptional and
                their compliance checks are thorough. Highly recommended.&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                  alt="Sarah Mitchell"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">Sarah Mitchell</h4>
                  <p className="text-slate-400 text-sm">
                    HR Director, Manchester Health Group
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="flex text-yellow-400 mb-4">
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                &quot;I moved from Australia to the UK and Hayaibu Talent made
                the entire process seamless. They handled my GMC registration,
                visa queries, and found me a perfect Band 6 role within a
                month.&quot;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80"
                  alt="Emma Wilson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-white">Emma Wilson</h4>
                  <p className="text-slate-400 text-sm">
                    Registered Nurse, Birmingham
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-primary to-primary p-12 rounded-3xl shadow-2xl text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 45,000+ healthcare professionals who have found their perfect
            role through Hayaibu Talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="bg-white text-primary font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-purple-50 transition text-lg cursor-pointer flex gap-2 items-center">
                <RiUserAddFill className="text-primary" /> Register as
                Candidate
              </button>
            </Link>
            {/* <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition text-lg cursor-pointer flex gap-2 items-center">
              <FaBriefcaseMedical /> Post a Vacancy
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
