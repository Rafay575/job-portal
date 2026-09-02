import React from "react";
import {
  Target,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { PiTarget, PiUserCircleDashedLight } from "react-icons/pi";
import { TfiStatsUp } from "react-icons/tfi";
import { GoShieldCheck } from "react-icons/go";

export default function ResumeServicesSection() {
  const features = [
    {
      icon: <PiTarget className="w-8 h-8 text-[#5b32d6]" />,
      title: "ATS-Friendly",
      description: "Optimized to pass ATS scanning",
    },
    {
      icon: <PiUserCircleDashedLight className="w-8 h-8 text-[#5b32d6]" />,
      title: "Tailored",
      description: "Custom resumes for your goals",
    },
    {
      icon: <TfiStatsUp className="w-8 h-8 text-[#5b32d6]" />,
      title: "Impact-Driven",
      description: "Showcase achievements that get noticed",
    },
    {
      icon: <GoShieldCheck className="w-8 h-8 text-[#5b32d6]" />,
      title: "Multiple Revisions",
      description: "We work with you until it's perfect",
    },
  ];

  const dotRows = [
    { dots: 1, sizes: ["w-[1.5px] h-[1.5px]"] },
    { dots: 2, sizes: ["w-[2px] h-[2px]", "w-[1.5px] h-[1.5px]"] },
    {
      dots: 3,
      sizes: ["w-[2.5px] h-[2.5px]", "w-[2px] h-[2px]", "w-[1.5px] h-[1.5px]"],
    },
    {
      dots: 4,
      sizes: [
        "w-[3px] h-[3px]",
        "w-[2.5px] h-[2.5px]",
        "w-[2px] h-[2px]",
        "w-[1.5px] h-[1.5px]",
      ],
    },
    {
      dots: 5,
      sizes: [
        "w-[3.5px] h-[3.5px]",
        "w-[3px] h-[3px]",
        "w-[2.5px] h-[2.5px]",
        "w-[2px] h-[2px]",
        "w-[1.5px] h-[1.5px]",
      ],
    },
    {
      dots: 6,
      sizes: [
        "w-[4px] h-[4px]",
        "w-[3.5px] h-[3.5px]",
        "w-[3px] h-[3px]",
        "w-[2.5px] h-[2.5px]",
        "w-[2px] h-[2px]",
        "w-[1.5px] h-[1.5px]",
      ],
    },
    {
      dots: 7,
      sizes: [
        "w-[4.5px] h-[4.5px]",
        "w-[4px] h-[4px]",
        "w-[3.5px] h-[3.5px]",
        "w-[3px] h-[3px]",
        "w-[2.5px] h-[2.5px]",
        "w-[2px] h-[2px]",
        "w-[1.5px] h-[1.5px]",
      ],
    },
  ];

  return (
    <section className="relative flex flex-col lg:flex-row justify-between items-center w-[95%] max-w-7xl  mx-auto bg-[#F1F0F5]  font-sans  rounded-3xl overflow-hidden mb-15 border-slate-100! border shadow-xl shadow-slate-200/50  ">
      {/* Bottom-Left Dotted Triangular Pattern */}
      <div className="absolute bottom-2 left-2 hidden sm:flex flex-col gap-3 pointer-events-none z-0">
        {dotRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-3">
            {Array.from({ length: row.dots }).map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`${row.sizes[dotIndex] || "w-1 h-1"} bg-[#5b32d6]/40 rounded-full inline-block`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="w-full lg:w-[45%] flex flex-col items-start gap-4 lg:gap-3 pr-8 lg:pr-0 pl-8 xl:pl-12  py-10 lg:py-0 order-2 lg:order-1 relative z-10">
        {/* Top Tagline */}
        <div className="flex items-center space-x-3 ">
          <div className="w-8 h-[1.5px] bg-[#5b32d6]"></div>
          <span className="text-[10px] font-bold text-[#5b32d6] tracking-[0.5px] text-[#1a1f36] uppercase">
            YOUR CAREER. OUR EXPERTISE. YOUR SUCCESS.
          </span>
        </div>
        <div className="w-full sm:w-[79%] title-container">
          {/* Main Heading */}
          <p className=" text-[3vw]  font-serif font-semibold text-[#101828] tracking-tight leading-[1] cv-title">
            Resume Writing
            <span className="text-[#5b32d6]"> Services</span>
          </p>
          <style jsx>{`
            @media (min-width: 1900px) {
              .cv-title {
                @apply text-[2vw]!;
              }
              .title-container {
                @apply w-full!;
              }
            }
          `}</style>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#4a5568] max-w-2xl  leading-relaxed">
            Professionally written resumes that highlight your strengths,
            showcase your value, and open doors to better opportunities.
          </p>
        </div>

        {/* Features Grid with vertical divider borders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full  ">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col gap sm:items-center ${
                index !== features.length - 1
                  ? "lg:border-r lg:border-gray-200 pr-2"
                  : ""
              }`}
            >
              <div className="">{feature.icon}</div>
              <h3 className="text-sm! font-bold text-[#101828] mt-2 sm:text-center">
                {feature.title}
              </h3>
              <p className="text-xs! text-[#4a5568] leading-[120%] sm:text-center mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <a href="https://www.etsy.com/uk/listing/4567265334/executive-resume-writing-service-ats?sr_prefetch=1&pf_from=shop_home&ref=shop_home_active_1&pro=1&dd=1&logging_key=fb710f35f46ead1d8fb472170a15ab4d3a0a5074%3A4567265334" target="_blank" rel="noopener noreferrer">
          <button className="inline-flex items-center justify-center bg-[#5b32d6] hover:bg-[#4b28b4] text-white font-bold py-2.5 px-10 rounded-sm transition-all shadow-md shadow-[#5b32d6]/20 group text-sm! mt-5 lg:mt-0 hover:cursor-pointer">
            <span className="">ORDER NOW</span>
            <FaRegArrowAltCircleRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 animate-arrow" />
          </button>
        </a>
      </div>
      <Image
        src="/cv-template-banner.jpg"
        alt="Resume Services"
        className="w-full lg:w-[55%] object-contain order-1 lg:order-2"
        width={800}
        height={400}
      />
    </section>
  );
}
