"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step2 from "@/components/formsteps/Step2";
import Step3 from "@/components/formsteps/Step3";
import Step4 from "@/components/formsteps/Step4";
import Step5 from "@/components/formsteps/Step5";
import Step6 from "@/components/formsteps/Step6";
import Step7 from "@/components/formsteps/Step7";
import Step8 from "@/components/formsteps/Step8";
import Step9 from "@/components/formsteps/Step9";
import Step10 from "@/components/formsteps/Step10";
import Step11 from "@/components/formsteps/Step11";

import { Label } from "@/components/ui/label";
import Stepper from "./Stepper";
import RoleSelector from "@/components/RoleSelector";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Step1FullTime from "@/components/formsteps/Step1FullTime";
import { checkApproval } from "@/lib/usersApproval";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStep1 } from "@/lib/api/step1";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const allStepLabels = [
  "Basic",
  "Question",
  "Background",
  "Health",
  "Registration",
  "Documents",
  "Training",
  "Qualification",
  "Experience",
  "Statement",
  "Declaration",
];

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = back
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handleNext = async (userId?: number) => {
    // 👇 Only apply logic on STEP 1
    if (step === 1 && (roleType === "agency-work" || roleType === "both")) {
      const isApproved = await checkApproval(userId!);

      if (!isApproved) {
        toast.success(
          "Your information is submitted. Please wait for admin approval for next steps. We will inform you via email once your application is reviewed.",
        );
        setDirection(1);
        setStep((prev) => prev + 1);

        return;
      }
    }

    // normal next
    if (step < totalSteps) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const back = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const [roleType, setRoleType] = useState<
    "permanent" | "agency-work" | "both"
  >("permanent");

  const steps =
    roleType === "permanent"
      ? [
          <Step1FullTime
            type={roleType}
            next={handleNext}
            back={back}
            key="step1"
            roleType={roleType}
          />,
        ]
      : [
          <Step1FullTime
            type={roleType}
            next={handleNext}
            back={back}
            key="step1"
            roleType={roleType}
          />,
          <Step2 next={handleNext} back={back} key="step2" />,
          <Step3 next={handleNext} back={back} key="step3" />,
          <Step4 next={handleNext} back={back} key="step4" />,
          <Step5 next={handleNext} back={back} key="step5" />,
          <Step6 next={handleNext} back={back} key="step6" />,
          <Step7 next={handleNext} back={back} key="step7" />,
          <Step8 next={handleNext} back={back} key="step8" />,
          <Step9 next={handleNext} back={back} key="step9" />,
          <Step10 next={handleNext} back={back} key="step10" />,
          <Step11 back={back} key="step11" />,
        ];

  const stepsforStepper =
    roleType === "permanent" ? [allStepLabels[0]] : allStepLabels;

  const totalSteps = steps.length;

  useEffect(() => {
    setStep(1);
  }, [roleType]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getStep1(user.id);
      if (res.success && !res.data[0]) {
        setOpen(true);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 overflow-hidden">
      {/* Shadcn Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="text-white">.</DialogTitle>
        <DialogContent className="sm:max-w-[50%] w-[90%]">
          <RoleSelector
            value={roleType}
            onChange={(role) => {
              setRoleType(role);
              setOpen(false); // optional: close modal after selection
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center gap-4 mb-3 w-full">
        <Label className="text-2xl text-primary">Choose Role Type</Label>

        <div className="flex gap-4 w-full md:w-[60%] ">
          {/* permanent */}
          <Button
            type="button"
            onClick={() => setRoleType("permanent")}
            className={`flex-1 py-2 border-2 rounded transition-all cursor-pointer
                ${
                  roleType === "permanent"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary hover:text-white"
                }`}
          >
            Permanent
          </Button>

          {/* agency-work */}
          <Button
            type="button"
            onClick={() => setRoleType("agency-work")}
            className={`flex-1 py-2 border-2 rounded transition-all cursor-pointer
                ${
                  roleType === "agency-work"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary hover:text-white"
                }`}
          >
            Agency Work
          </Button>

          {/* Both */}
          <Button
            type="button"
            onClick={() => setRoleType("both")}
            className={`flex-1 py-2 border-2 rounded transition-all cursor-pointer
                ${
                  roleType === "both"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary hover:text-white"
                }`}
          >
            Both
          </Button>
        </div>
      </div>
      <hr className="my-5 border-slate-200" />
      <div
        className={`
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          ${
            roleType === "permanent"
              ? "max-h-0 opacity-0"
              : "max-h-auto opacity-100"
          }
        `}
      >
        <Stepper
          currentStep={step}
          userId={user.id}
          setCurrentStep={setStep}
          steps={stepsforStepper}
        />
      </div>

      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {steps[step - 1]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
