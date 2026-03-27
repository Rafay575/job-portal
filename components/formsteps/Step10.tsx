"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step10Type } from "@/types/Form";

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

export default function Step10({ next, back }: Props) {
  const [formData, setFormData] = useState<Step10Type>({
    supportingStatement: "",
  });

  const validateStep = (): boolean => {
    const wordCount = formData.supportingStatement.trim().split(/\s+/).length;

    if (!formData.supportingStatement || wordCount > 150) {
      toast.error("Please provide a supporting statement (max 150 words)");
      return false;
    }

    return true;
  };

  return (
    <div className="min-w-full space-y-3 p-1 flex flex-col">
      <Label>Supporting Statement (Max 150 words)</Label>
      <Textarea
        value={formData.supportingStatement}
        onChange={(e) =>
          setFormData({ ...formData, supportingStatement: e.target.value })
        }
        placeholder="Why are you applying & how do you match the role?"
        className="py-3 min-h-[150px]"
      />
      <SignupNavButtons
        onBack={back}
         onNext={() => {
          if (validateStep()) {
            console.log("Step7 Data:", formData); // ✅ log here
            next();
          }
        }}
      />
    </div>
  );
}