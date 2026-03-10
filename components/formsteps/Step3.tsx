"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
export default function Step3({ next, back }: Props) {
  // Criminal & Compliance
  const [hasConvictions, setHasConvictions] = useState("no");
  const [convictionDetails, setConvictionDetails] = useState("");
  const [hasUnspentConvictions, setHasUnspentConvictions] = useState("no");
  const [unspentDetails, setUnspentDetails] = useState("");
  const [fitnessInvestigation, setFitnessInvestigation] = useState("no");
  const [removedFromRegister, setRemovedFromRegister] = useState("no");
  const [crb, setCrb] = useState<"yes" | "no">("no");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [crbFile, setCrbFile] = useState<File | null>(null);

  const validateStep = (): boolean => {
    if (hasConvictions === "yes" && !convictionDetails) {
      toast.error("Please provide conviction details");
      return false;
    }

    if (hasUnspentConvictions === "yes" && !unspentDetails) {
      toast.error("Please provide unspent conviction details");
      return false;
    }

    if (crb === "yes") {
      if (!surname) {
        toast.error("Surname is required");
        return false;
      }

      if (!dob) {
        toast.error("Date of birth is required");
        return false;
      }

      if (!crbFile) {
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
        <div className="flex flex-col items-stretch gap-4 ">
          <div>
            <Label>Any convictions?</Label>
            <RadioGroup
              value={hasConvictions}
              onValueChange={setHasConvictions}
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
            className={`transition-all duration-500 ease-in-out  ${hasConvictions === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}
          >
            <Label>Conviction Details *</Label>
            <Textarea
              value={convictionDetails}
              onChange={(e) => setConvictionDetails(e.target.value)}
            />
          </div>
        </div>
        {/* Unspent */}
        <div className="flex flex-col items-stretch gap-4 ">
          <div>
            <Label>Any unspent convictions?</Label>
            <RadioGroup
              value={hasUnspentConvictions}
              onValueChange={setHasUnspentConvictions}
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
            className={`transition-all duration-500 ease-in-out  ${hasUnspentConvictions === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}
          >
            <Label>Unspent Conviction Details *</Label>
            <Textarea
              value={unspentDetails}
              onChange={(e) => setUnspentDetails(e.target.value)}
            />
          </div>
        </div>

        {/* Fitness */}
        <div>
          <Label>Currently under fitness to practice investigation?</Label>
          <RadioGroup
            value={fitnessInvestigation}
            onValueChange={setFitnessInvestigation}
          >
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="fitnessYes" />
              <Label htmlFor="fitnessYes">Yes</Label>
              <RadioGroupItem value="no" id="fitnessNo" />
              <Label htmlFor="fitnessNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Removed */}
        <div>
          <Label>Removed from professional register before?</Label>
          <RadioGroup
            value={removedFromRegister}
            onValueChange={setRemovedFromRegister}
          >
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="removedYes" />
              <Label htmlFor="removedYes">Yes</Label>
              <RadioGroupItem value="no" id="removedNo" />
              <Label htmlFor="removedNo">No</Label>
            </div>
          </RadioGroup>
        </div>
        {/* CRB Section */}
        <div className="flex flex-col items-stretch gap-4 md:col-span-2">
          {/* Radio */}
          <div>
            <Label>Any CRB?</Label>
            <RadioGroup value={crb} onValueChange={(val: any) => setCrb(val)}>
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
              crb === "yes"
                ? "opacity-100 max-h-[500px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              {/* Surname */}
              <div>
                <Label>Surname *</Label>
                <Input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Enter surname"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div>
                <Label>Upload CRB *</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) =>
                    setCrbFile(e.target.files ? e.target.files[0] : null)
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
            next();
          }
        }}
      />
    </>
  );
}
