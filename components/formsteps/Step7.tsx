"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { Step7Type } from "@/types/Form";

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={disableBack}
      >
        <IoIosArrowBack />
        Back
      </Button>

      <Button type="button" onClick={onNext}>
        Next
        <IoIosArrowForward />
      </Button>
    </div>
  );
}

type Props = {
  next: () => void;
  back: () => void;
};
export default function Step7({ next, back }: Props) {
  const [step] = useState(7);

  const [trainings, setTrainings] = useState<Step7Type[]>([
    { title: "", provider: "", duration: "", completionDate: "" },
  ]);

  const updateTraining = (
    index: number,
    field: keyof Step7Type,
    value: string,
  ) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  const addTraining = () => {
    setTrainings([
      ...trainings,
      { title: "", provider: "", duration: "", completionDate: "" },
    ]);
  };

  const removeTraining = (index: number) => {
    setTrainings(trainings.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    for (let i = 0; i < trainings.length; i++) {
      const t = trainings[i];

      if (!t.title || !t.provider || !t.duration || !t.completionDate) {
        toast.error(`Please complete all fields for training ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <div className="min-w-full space-y-5  grid gap-x-5 gap-y-3 grid-cols-1 md:grid-cols-2  mb-3 ">
        <AnimatePresence>
          {trainings.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -40, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="border p-4 rounded-lg space-y-3 mb-0"
            >
              <Label>Training / Course {index + 1}</Label>

              <Input
                value={t.title}
                placeholder="Course Title"
                onChange={(e) => updateTraining(index, "title", e.target.value)}
              />

              <Input
                value={t.provider}
                placeholder="Training Provider"
                onChange={(e) =>
                  updateTraining(index, "provider", e.target.value)
                }
              />

              <Input
                value={t.duration}
                placeholder="Duration"
                onChange={(e) =>
                  updateTraining(index, "duration", e.target.value)
                }
              />

              <Input
                type="date"
                value={t.completionDate}
                onChange={(e) =>
                  updateTraining(index, "completionDate", e.target.value)
                }
              />

              {trainings.length > 1 && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeTraining(index)}
                >
                  Remove
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button type="button" onClick={addTraining}>
        Add Another Training
      </Button>

      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            console.log("Step7 Data:", trainings); // ✅ log here
            next();
          }
        }}
      />
    </>
  );
}
