"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Reference = {
  name: string;
  position: string;
  relationship: string;
  phone: string;
  email: string;
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

export default function Step6() {
  const [step] = useState(6);

  const [references, setReferences] = useState<Reference[]>([
    { name: "", position: "", relationship: "", phone: "", email: "" },
    { name: "", position: "", relationship: "", phone: "", email: "" },
  ]);

  const updateReference = (
    index: number,
    field: keyof Reference,
    value: string,
  ) => {
    const updated = [...references];
    updated[index][field] = value;
    setReferences(updated);
  };

  const addReference = () => {
    setReferences([
      ...references,
      { name: "", position: "", relationship: "", phone: "", email: "" },
    ]);
  };

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];

      if (
        !ref.name ||
        !ref.position ||
        !ref.relationship ||
        !ref.phone ||
        !ref.email
      ) {
        toast.error(`Please complete all fields for reference ${i + 1}`);
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
        toast.error(`Invalid email for reference ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        References 
      </h2>

      <div className="min-w-full space-y-5  grid gap-x-5 gap-y-3 grid-cols-1 md:grid-cols-2  mb-3">
        {references.map((ref, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3 mb-0">
            <Label>Reference {index + 1}</Label>

            <Input
              value={ref.name}
              placeholder="Reference Name"
              onChange={(e) => updateReference(index, "name", e.target.value)}
            />

            <Input
              value={ref.position}
              placeholder="Position"
              onChange={(e) =>
                updateReference(index, "position", e.target.value)
              }
            />

            <Input
              value={ref.relationship}
              placeholder="Relationship"
              onChange={(e) =>
                updateReference(index, "relationship", e.target.value)
              }
            />

            <Input
              value={ref.phone}
              placeholder="Contact Number"
              onChange={(e) => updateReference(index, "phone", e.target.value)}
            />

            <Input
              value={ref.email}
              placeholder="Email"
              onChange={(e) => updateReference(index, "email", e.target.value)}
            />

            {references.length > 2 && (
              <Button
                variant="destructive"
                type="button"
                onClick={() => removeReference(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="button" onClick={addReference}>
        Add Another Reference
      </Button>

      <SignupNavButtons step={step} validateStep={validateStep} />
    </>
  );
}
