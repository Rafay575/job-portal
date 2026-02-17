"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { Check } from "lucide-react";

const steps = [
  "Basic",
  "Question",
  "Criminal",
  "Health",
  "Registration",
  "References",
  "Training",
  "Employment",
  "Experience",
  "Statement",
  "Declaration",
];

export default function Stepper() {
  const pathname = usePathname();

  const currentStep = Number(pathname?.split("step")[1]) || 1;

  return (
    <div className="justify-between mb-8 hidden md:flex">
      {steps.map((step, index) => {
        const stepNumber = index + 1;

        return (
          <div key={stepNumber} className="flex flex-col items-center flex-1">
            <Link href={`/auth/signup/step${stepNumber}`} className="z-[2]">
              <div
                className={clsx(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer",
                  {
                    "bg-primary text-white": stepNumber <= currentStep,
                    "bg-gray-200 text-gray-500": stepNumber > currentStep,
                  }
                )}
              >
                {/* CHECK ICON FOR COMPLETED STEPS */}
                {stepNumber < currentStep ? (
                  <Check size={16} className="stroke-[3]" />
                ) : (
                  stepNumber
                )}
              </div>
            </Link>

            {/* STEP NAME */}
            <span
              className={clsx(
                "text-xs mt-2 text-center max-w-[70px]",
                stepNumber <= currentStep
                  ? "text-primary font-medium"
                  : "text-gray-400"
              )}
            >
              {step}
            </span>

            {stepNumber !== steps.length && (
              <div
                className={clsx(
                  "h-[2px] w-full -mt-10 ml-4 md:ml-13 z-[1]",
                  stepNumber < currentStep ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
