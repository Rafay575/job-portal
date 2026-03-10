"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
export default function Step5({ next, back }: Props) {
  const [professionalBody, setProfessionalBody] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationExpiry, setRegistrationExpiry] = useState("");
  const [isNurse, setIsNurse] = useState<"yes" | "no">("no");

  const validateStep = (): boolean => {
    if (isNurse === "yes") {
      if (
        !professionalBody ||
        !registrationType ||
        !registrationNumber ||
        !registrationExpiry
      ) {
        toast.error("Please complete all professional registration fields");
        return false;
      }
    }
    return true;
  };

  return (
    <>
      {/* Nurse Radio */}
      <div className="col-span-2 mb-2">
        <Label>Are you a Nurse?</Label>

        <RadioGroup
          value={isNurse}
          onValueChange={(val: any) => setIsNurse(val)}
        >
          <div className="flex gap-4 mt-2 items-center">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="nurseYes" />
              <Label htmlFor="nurseYes">Yes</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="nurseNo" />
              <Label htmlFor="nurseNo">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className={`min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2 transition-all duration-500 ease-in-out ${
              isNurse === "yes"
                ? "opacity-100 max-h-[500px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}>
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
      </div>
      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            next();
          }
        }}
      />
    </>
  );
}
