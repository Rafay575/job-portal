"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Training = {
  title: string;
  provider: string;
  duration: string;
  completionDate: string;
};

type Props = {
  step: number;
  validateStep: () => boolean;
};

function SignupNavButtons({ step, validateStep }: Props) {
  const router = useRouter();

  const handleNext = () => {
    if (validateStep()) {
      router.push(`/auth/signup/step${step + 1}`);
    }
  };

  const handleBack = () => {
    router.push(`/auth/signup/step${step - 1}`);
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button variant="outline" onClick={handleBack}>
        Back
      </Button>

      <Button onClick={handleNext}>Next</Button>
    </div>
  );
}

export default function Step7() {
  const [step] = useState(7);

  const [trainings, setTrainings] = useState<Training[]>([
    { title: "", provider: "", duration: "", completionDate: "" },
  ]);

  const updateTraining = (
    index: number,
    field: keyof Training,
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
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        Training & Courses
      </h2>

      <div className="min-w-full space-y-5  grid gap-x-5 gap-y-3 grid-cols-1 md:grid-cols-2  mb-3">
        {trainings.map((t, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3 mb-0">
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
          </div>
        ))}
      </div>

      <Button type="button" onClick={addTraining}>
        Add Another Training
      </Button>

      <SignupNavButtons step={step} validateStep={validateStep} />
    </>
  );
}
