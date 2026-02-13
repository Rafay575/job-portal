"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type MandatoryExperience = {
  areas: string[];
  vulnerableDefinition: string;
  properCareMeasures: string;
  nonVerbalChoice: string;
  abuseAction: string;
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

export default function Step9() {
  const [step] = useState(9);

  const [mandatoryExperience, setMandatoryExperience] =
    useState<MandatoryExperience>({
      areas: [],
      vulnerableDefinition: "",
      properCareMeasures: "",
      nonVerbalChoice: "",
      abuseAction: "",
    });

  const areas = [
    "Mental Health",
    "Learning Disabilities",
    "Drug & Alcohol",
    "Housing",
    "Elderly",
    "Children/Young People",
  ];

  const toggleArea = (area: string) => {
    setMandatoryExperience((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));
  };

  const validateStep = (): boolean => {
    if (
      mandatoryExperience.areas.length === 0 ||
      !mandatoryExperience.vulnerableDefinition ||
      !mandatoryExperience.properCareMeasures ||
      !mandatoryExperience.nonVerbalChoice ||
      !mandatoryExperience.abuseAction
    ) {
      toast.error("Please complete all mandatory experience fields");
      return false;
    }

    return true;
  };

  return (
    <>
      <h2 className="text-primary text-3xl font-medium  mb-4 md:mb-7 text-center">
        Mandatory Experience
      </h2>

      <div className="min-w-full space-y-5 p-1 flex flex-col gap-1">
        <Label>Select all that apply *</Label>

        <div className="flex flex-col gap-0.5">
          {areas.map((area) => (
            <div key={area} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mandatoryExperience.areas.includes(area)}
                onChange={() => toggleArea(area)}
                className="h-4 w-4"
              />
              <Label>{area}</Label>
            </div>
          ))}
        </div>

        <Label>Definition of vulnerable people *</Label>
        <Textarea
          value={mandatoryExperience.vulnerableDefinition}
          onChange={(e) =>
            setMandatoryExperience((prev) => ({
              ...prev,
              vulnerableDefinition: e.target.value,
            }))
          }
        />

        <Label>Measures to ensure proper care *</Label>
        <Textarea
          value={mandatoryExperience.properCareMeasures}
          onChange={(e) =>
            setMandatoryExperience((prev) => ({
              ...prev,
              properCareMeasures: e.target.value,
            }))
          }
        />

        <Label>Helping a non-verbal client make choices *</Label>
        <Textarea
          value={mandatoryExperience.nonVerbalChoice}
          onChange={(e) =>
            setMandatoryExperience((prev) => ({
              ...prev,
              nonVerbalChoice: e.target.value,
            }))
          }
        />

        <Label>Action if witnessing abuse *</Label>
        <Textarea
          value={mandatoryExperience.abuseAction}
          onChange={(e) =>
            setMandatoryExperience((prev) => ({
              ...prev,
              abuseAction: e.target.value,
            }))
          }
        />

        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
    </>
  );
}
