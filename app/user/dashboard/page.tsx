"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Step1 from "@/components/formsteps/Step1";
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Stepper from "./Stepper";
import RoleSelector from "@/components/RoleSelector";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function Page() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = back
  const [open, setOpen] = useState(false);
  const totalSteps = 11;
const [roleType, setRoleType] = useState<"full" | "part" | "both">("full");
  const next = () => {
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

  const steps = [
    <Step1 next={next} back={back} />,
    <Step2 next={next} back={back} />,
    <Step3 next={next} back={back} />,
    <Step4 next={next} back={back} />,
    <Step5 next={next} back={back} />,
    <Step6 next={next} back={back} />,
    <Step7 next={next} back={back} />,
    <Step8 next={next} back={back} />,
    <Step9 next={next} back={back} />,
    <Step10 next={next} back={back} />,
    <Step11 back={back} />,
  ];

  // Open modal on first render
  useEffect(() => {
    setOpen(true);
  }, []);
  return (
    <div className="p-4 overflow-hidden">
      {/* Shadcn Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[60%] w-[90%]">
          <RoleSelector />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center gap-4 mb-3">
      <Label>Choose Role Type</Label>

      <RadioGroup
        value={roleType}
        onValueChange={(value) => setRoleType(value as "full" | "part" | "both")}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="full" id="full" />
          <Label htmlFor="full">Full-time</Label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="part" id="part" />
          <Label htmlFor="part">Part-time</Label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="both" id="both" />
          <Label htmlFor="both">Both</Label>
        </div>
      </RadioGroup>
    </div>
      <Stepper currentStep={step} setCurrentStep={setStep} />
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
