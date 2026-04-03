"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Role {
  id: "agency-work" | "permanent" | "both";
  title: string;
  description: string;
  image: string;
}

interface RoleSelectorProps {
  value: "agency-work" | "permanent" | "both";
  onChange: (role: "agency-work" | "permanent" | "both") => void;
}

const roles: Role[] = [
  {
    id: "permanent",
    title: "Permanent Role",
    description: "Flexible hours, work part of the day",
    image: "/role-icon2.png",
  },
  {
    id: "agency-work",
    title: "Agency Work Role",
    description: "Flexible hours, work part of the day",
    image: "/role-icon1.png",
  },
  {
    id: "both",
    title: "Both",
    description: "Flexible hours, work part of the day",
    image: "/role-icon3.png",
  },
];

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="py-5 xl:py-8  sm:px-2 lg:px-8">
      <div className="w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            What type of role are you looking?
          </h1>
        </div>
       
        <div className="grid grid-cols-1  md:grid-cols-3 gap-2 xl:gap-4">
          {roles.map((role) => {
            const isSelected = value == role.id;

            return (
              <button
                key={role.id}
                onClick={() => onChange(role.id)}
                className={`relative flex border flex-col items-center py-4 md:py-13 px-4 xl:px-8 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "bg-slate-100 shadow-lg"
                    : "bg-white  border-slate-200 hover:border-gray-400"
                }`}
              >
                {/* Radio indicator */}
                <div
                  className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? "#5C49D8" : "#D1D5DB",
                    backgroundColor: isSelected ? "#5C49D8" : "transparent",
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                <div className="mb-6 hidden lg:block">
                  <Image
                    src={role.image}
                    alt="icon"
                    width={100}
                    height={100}
                    unoptimized
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {role.title}
                </h3>

                <p className="text-gray-600 text-sm lg:mb-6 flex-grow">
                  {role.description}
                </p>

                <div
                  className={`w-full py-3 px-6 rounded-full font-semibold text-center hidden lg:block ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-primary text-white/80"
                  }`}
                >
                  Select
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
