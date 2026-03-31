"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

import { Step7Type } from "@/types/Form";
import { getTrainings, saveTrainings } from "@/lib/api/step7";
import { user_id } from "@/lib/id";

// ================= NAV BUTTONS =================
function SignupNavButtons({ onNext, onBack }: any) {
  return (
    <div className="flex justify-between mt-4">
      <Button type="button" variant="outline" onClick={onBack}>
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

// ================= MAIN COMPONENT =================
export default function Step7({ next, back }: any) {
  const [trainings, setTrainings] = useState<Step7Type[]>([
    { title: "", provider: "", duration: "", completionDate: "" },
  ]);

  // ================= FETCH EXISTING DATA =================
  useEffect(() => {
    const fetchData = async () => {
      const res = await getTrainings(user_id);

      if (res.success && res.data?.length > 0) {
        setTrainings(
          res.data.map((t: any) => ({
            title: t.title,
            provider: t.provider,
            duration: t.duration,
            completionDate: t.completion_date,
          }))
        );
      }
    };

    fetchData();
  }, []);

  // ================= UPDATE FIELD =================
  const updateTraining = (index: number, field: keyof Step7Type, value: string) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  // ================= ADD =================
  const addTraining = () => {
    setTrainings([
      ...trainings,
      { title: "", provider: "", duration: "", completionDate: "" },
    ]);
  };

  // ================= REMOVE =================
  const removeTraining = (index: number) => {
    setTrainings(trainings.filter((_, i) => i !== index));
  };

  // ================= VALIDATION =================
  const validateStep = () => {
    for (let i = 0; i < trainings.length; i++) {
      const t = trainings[i];

      if (!t.title || !t.provider || !t.duration || !t.completionDate) {
        toast.error(`Complete all fields for training ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // ================= SUBMIT (CREATE + UPDATE SAME API) =================
  const handleSubmit = async () => {
    if (!validateStep()) return;

    const res = await saveTrainings(user_id, trainings);

    if (res.success) {
      toast.success(res.message);
      next();
    } else {
      toast.error(res.message);
    }
  };

  // ================= UI =================
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {trainings.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border rounded-xl p-4 space-y-3 bg-white shadow-sm"
            >
              <Label className="font-semibold text-lg color">
                Training {index + 1}
              </Label>

              <Input
                placeholder="Course Title"
                value={t.title}
                onChange={(e) =>
                  updateTraining(index, "title", e.target.value)
                }
              />

              <Input
                placeholder="Provider"
                value={t.provider}
                onChange={(e) =>
                  updateTraining(index, "provider", e.target.value)
                }
              />

              <Input
                placeholder="Duration"
                value={t.duration}
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
                  type="button"
                  variant="destructive"
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
        onNext={handleSubmit}
      />
    </div>
  );
}