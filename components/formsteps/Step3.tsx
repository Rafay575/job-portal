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
  const [dbsNumber, setDbsNumber] = useState("");
  const [dbsExpiry, setDbsExpiry] = useState("");

  const validateStep = (): boolean => {
    if (hasConvictions === "yes" && !convictionDetails) {
      toast.error("Please provide conviction details");
      return false;
    }

    if (hasUnspentConvictions === "yes" && !unspentDetails) {
      toast.error("Please provide unspent conviction details");
      return false;
    }

    if (!dbsNumber || !dbsExpiry) {
      toast.error("DBS number and expiry date are required");
      return false;
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

            <div className={`transition-all duration-500 ease-in-out  ${hasUnspentConvictions === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}>
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

        {/* DBS */}
        <div>
          <Label>Previous CRB / DBS Number *</Label>
          <Input
            value={dbsNumber}
            onChange={(e) => setDbsNumber(e.target.value)}
          />
        </div>

        <div>
          <Label>CRB / DBS Expiry Date *</Label>
          <Input
            type="date"
            value={dbsExpiry}
            onChange={(e) => setDbsExpiry(e.target.value)}
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
