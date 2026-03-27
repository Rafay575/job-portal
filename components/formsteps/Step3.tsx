"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step3Type } from "@/types/Form";
// ------------------ Types ------------------


type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

type Props = {
  next: () => void;
  back: () => void;
};

// ------------------ Navigation Buttons ------------------
function SignupNavButtons({ onNext, onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      <Button type="button" variant="outline" onClick={onBack} disabled={disableBack}>
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

// ------------------ Step 3 Component ------------------
export default function Step3({ next, back }: Props) {
  const [formData, setFormData] = useState<Step3Type>({
    hasConvictions: "no",
    convictionDetails: "",
    hasUnspentConvictions: "no",
    unspentDetails: "",
    fitnessInvestigation: "no",
    removedFromRegister: "no",
    crb: "no",
    surname: "",
    dob: "",
    crbFile: null,
  });

  const handleChange = <K extends keyof Step3Type>(key: K, value: Step3Type[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    if (formData.hasConvictions === "yes" && !formData.convictionDetails) {
      toast.error("Please provide conviction details");
      return false;
    }

    if (formData.hasUnspentConvictions === "yes" && !formData.unspentDetails) {
      toast.error("Please provide unspent conviction details");
      return false;
    }

    if (formData.crb === "yes") {
      if (!formData.surname) {
        toast.error("Surname is required");
        return false;
      }

      if (!formData.dob) {
        toast.error("Date of birth is required");
        return false;
      }

      if (!formData.crbFile) {
        toast.error("Please upload CRB document");
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Convictions */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Any convictions?</Label>
            <RadioGroup
              value={formData.hasConvictions}
              onValueChange={(v) => handleChange("hasConvictions", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="convictYes" />
                <Label htmlFor="convictYes">Yes</Label>
                <RadioGroupItem value="no" id="convictNo" />
                <Label htmlFor="convictNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.hasConvictions === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Conviction Details *</Label>
            <Textarea
              value={formData.convictionDetails}
              onChange={(e) => handleChange("convictionDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Unspent Convictions */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Any unspent convictions?</Label>
            <RadioGroup
              value={formData.hasUnspentConvictions}
              onValueChange={(v) => handleChange("hasUnspentConvictions", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="unspentYes" />
                <Label htmlFor="unspentYes">Yes</Label>
                <RadioGroupItem value="no" id="unspentNo" />
                <Label htmlFor="unspentNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.hasUnspentConvictions === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Unspent Conviction Details *</Label>
            <Textarea
              value={formData.unspentDetails}
              onChange={(e) => handleChange("unspentDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Fitness Investigation */}
        <div>
          <Label>Currently under fitness to practice investigation?</Label>
          <RadioGroup
            value={formData.fitnessInvestigation}
            onValueChange={(v) => handleChange("fitnessInvestigation", v as "yes" | "no")}
          >
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="fitnessYes" />
              <Label htmlFor="fitnessYes">Yes</Label>
              <RadioGroupItem value="no" id="fitnessNo" />
              <Label htmlFor="fitnessNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Removed From Register */}
        <div>
          <Label>Removed from professional register before?</Label>
          <RadioGroup
            value={formData.removedFromRegister}
            onValueChange={(v) => handleChange("removedFromRegister", v as "yes" | "no")}
          >
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="removedYes" />
              <Label htmlFor="removedYes">Yes</Label>
              <RadioGroupItem value="no" id="removedNo" />
              <Label htmlFor="removedNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* CRB */}
        <div className="flex flex-col items-stretch gap-4 md:col-span-2">
          <div>
            <Label>Any CRB?</Label>
            <RadioGroup
              value={formData.crb}
              onValueChange={(v) => handleChange("crb", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2 items-center">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="crbYes" />
                  <Label htmlFor="crbYes">Yes</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="crbNo" />
                  <Label htmlFor="crbNo">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional Fields */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.crb === "yes"
                ? "opacity-100 max-h-[500px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <div>
                <Label>Surname *</Label>
                <Input
                  value={formData.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  placeholder="Enter surname"
                />
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>

              <div>
                <Label>Upload CRB *</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) =>
                    handleChange("crbFile", e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            console.log("Step3 Data:", formData); // ✅ log here
            next();
          }
        }}
      />
    </>
  );
}