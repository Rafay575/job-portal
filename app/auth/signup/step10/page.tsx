"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      <Button variant="outline" onClick={handleBack}>
        Back
      </Button>

      <Button onClick={handleNext}>Next</Button>
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
      </Button>
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
    </div>
  );
}

export default function Step10() {
  const [step] = useState(10);
  const [supportingStatement, setSupportingStatement] = useState("");

  const validateStep = (): boolean => {
    const wordCount = supportingStatement.trim().split(/\s+/).length;

    if (!supportingStatement || wordCount > 150) {
      toast.error("Please provide a supporting statement (max 150 words)");
      return false;
    }

    return true;
  };

  return (
    <>
<<<<<<< HEAD
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        Supporting Statement
      </h2>
=======
      
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db

      <div className="min-w-full space-y-3 p-1 flex flex-col">
        <Label>Supporting Statement (Max 150 words)</Label>

        <Textarea
          value={supportingStatement}
          onChange={(e) => setSupportingStatement(e.target.value)}
          placeholder="Why are you applying & how do you match the role?"
          className="py-3 min-h-[150px]"
        />

        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
    </>
  );
}
