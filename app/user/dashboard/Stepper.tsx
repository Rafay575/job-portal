"use client";
import { checkApproval } from "@/lib/users";
import clsx from "clsx";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  userId: string | number | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Stepper({
  userId,
  steps,
  currentStep,
  setCurrentStep,
}: StepperProps) {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!userId) return; // ✅ prevent undefined call

    const fetchApproval = async () => {
      console.log("userId", userId);
      const { isApproved } = await checkApproval(userId);
      setIsApproved(isApproved); // ✅ safe
    };

    fetchApproval();
  }, [userId]);

  return (
    <div className="hidden lg:flex justify-between mb-10 w-full relative">
      {steps.map((label, index) => {
        const stepNumber = index + 1;

        // 🔥 lock logic
        const isLocked = !isApproved && stepNumber > 1;

        return (
          <div
            key={stepNumber}
            className={clsx(
              "flex flex-col items-center flex-1 relative transition-all p-1",
              {
                " blur-[3px] pointer-events-none": isLocked, // 👈 blur + disable
              },
            )}
          >
            {/* Step Circle */}
            <div

            
              // onClick={() => {
              //   if (!isLocked ) {
              //     setCurrentStep(stepNumber);
              //   }
              // }}


              className={clsx(
                "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 z-10",
                {
                  "bg-primary text-white shadow-md": stepNumber <= currentStep,
                  "bg-gray-200 text-gray-500": stepNumber > currentStep,
                  "cursor-not-allowed": isLocked,
                },
              )}
            >
              {stepNumber < currentStep ? (
                <Check size={16} className="stroke-[3]" />
              ) : (
                stepNumber
              )}
            </div>

            {/* Step Label */}
            <span
              className={clsx(
                "text-xs mt-2 text-center max-w-[90px]",
                stepNumber <= currentStep
                  ? "text-primary font-semibold"
                  : "text-gray-400",
              )}
            >
              {label}
            </span>

            {/* Connecting Line */}
            {stepNumber !== steps.length && (
              <div
                className={clsx(
                  "absolute top-5 left-1/2 w-full h-[2px] -z-0 transition-colors duration-300",
                  stepNumber < currentStep ? "bg-primary" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
