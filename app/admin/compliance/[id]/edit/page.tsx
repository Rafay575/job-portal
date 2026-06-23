"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Step1FullTime from "@/components/admin-formsteps/Step1FullTime";
import Step2 from "@/components/admin-formsteps/Step2";
import Step3 from "@/components/admin-formsteps/Step3";
import Step4 from "@/components/admin-formsteps/Step4";
import Step5 from "@/components/admin-formsteps/Step5";
import Step6 from "@/components/admin-formsteps/Step6";
import Step7 from "@/components/admin-formsteps/Step7";
import Step8 from "@/components/admin-formsteps/Step8";
import Step9 from "@/components/admin-formsteps/Step9";
import Step10 from "@/components/admin-formsteps/Step10";
import Step11 from "@/components/admin-formsteps/Step11";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { checkApproval } from "@/lib/users";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getStep1 } from "@/lib/api/step1";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Stepper2 from "@/components/Stepper2";

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

export default function EditUserPage() {
  const params = useParams();
  const id = params.id;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = back


  const handleNext = async () => {
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
            userId={id}
            key="step1"
            roleType={roleType}
          />,
        ]
      : [
          <Step1FullTime
            type={roleType}
            next={handleNext}
            back={back}
            userId={id}
            key="step1"
            roleType={roleType}
          />,
          <Step2 next={handleNext} back={back} userId={id} key="step2" />,
          <Step3 next={handleNext} back={back} userId={id} key="step3" />,
          <Step4 next={handleNext} back={back} userId={id} key="step4" />,
          <Step5 next={handleNext} back={back} userId={id} key="step5" />,
          <Step6 next={handleNext} back={back} userId={id} key="step6" />,
          <Step7 next={handleNext} back={back} userId={id} key="step7" />,
          <Step8 next={handleNext} back={back} userId={id} key="step8" />,
          <Step9 next={handleNext} back={back} userId={id} key="step9" />,
          <Step10 next={handleNext} back={back} userId={id} key="step10" />,
          <Step11 back={back} userId={id} key="step11" />,
        ];

  const stepsforStepper =
    roleType === "permanent" ? [allStepLabels[0]] : allStepLabels;

  const totalSteps = steps.length;

  useEffect(() => {
    setStep(1);
  }, [roleType]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getStep1(id);
      console.log("res",res)
      if (res.success === false) {
      } else {
        setRoleType(res.data[0].type);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden p-5">
      <div className="flex flex-col items-center gap-1 mb-3 w-full">
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
        <Stepper2
          currentStep={step}
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
