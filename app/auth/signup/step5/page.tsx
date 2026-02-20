"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
=======
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db

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
<<<<<<< HEAD
    <div className="flex gap-2 mt-3">
      <Button type="button" variant="outline" onClick={handleBack}>
        Back
      </Button>

      <Button type="button" onClick={handleNext}>
        Next
=======
    <div className="flex gap-2 mt-3 justify-between ">
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={step === 1}
      >
        <IoIosArrowBack />Back
      </Button>

      <Button type="button" onClick={handleNext}>
        Next<IoIosArrowForward />
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      </Button>
    </div>
  );
}

export default function Step5() {
  const [step] = useState(5);

  const [professionalBody, setProfessionalBody] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationExpiry, setRegistrationExpiry] = useState("");

  const validateStep = (): boolean => {
    if (
      !professionalBody ||
      !registrationType ||
      !registrationNumber ||
      !registrationExpiry
    ) {
      toast.error("Please complete all professional registration fields");
      return false;
    }

    return true;
  };

  return (
    <>
<<<<<<< HEAD
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        Professional Registration
      </h2>

=======
     
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        <div>
          <Label>Professional Body Name *</Label>
          <Input
            value={professionalBody}
            onChange={(e) => setProfessionalBody(e.target.value)}
            placeholder="e.g. Nursing & Midwifery Council"
          />
        </div>

        <div>
          <Label>Registration Type *</Label>
          <Input
            value={registrationType}
            onChange={(e) => setRegistrationType(e.target.value)}
            placeholder="e.g. PIN"
          />
        </div>

        <div>
          <Label>Registration / PIN Number *</Label>
          <Input
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
        </div>

        <div>
          <Label>Expiry Date *</Label>
          <Input
            type="date"
            value={registrationExpiry}
            onChange={(e) => setRegistrationExpiry(e.target.value)}
          />
        </div>

<<<<<<< HEAD
        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
=======
      </div>
        <SignupNavButtons step={step} validateStep={validateStep} />
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
    </>
  );
}
