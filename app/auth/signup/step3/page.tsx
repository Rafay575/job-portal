"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <div className="flex gap-2 mt-3 ">
=======
    <div className="flex gap-2 mt-3 justify-between ">
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={step === 1}
      >
<<<<<<< HEAD
        Back
      </Button>

      <Button type="button" onClick={handleNext}>
        Next
=======
        <IoIosArrowBack />Back
      </Button>

      <Button type="button" onClick={handleNext}>
        Next<IoIosArrowForward />
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      </Button>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
export default function Step3() {
  const [step] = useState(3);

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
<<<<<<< HEAD
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        Criminal & Compliance
      </h2>
=======
    
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db

      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Convictions */}
        <div>
          <Label>Any convictions?</Label>
          <RadioGroup value={hasConvictions} onValueChange={setHasConvictions}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="convictYes" />
              <Label htmlFor="convictYes">Yes</Label>
              <RadioGroupItem value="no" id="convictNo" />
              <Label htmlFor="convictNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {hasConvictions === "yes" && (
          <div>
            <Label>Conviction Details *</Label>
            <Textarea
              value={convictionDetails}
              onChange={(e) => setConvictionDetails(e.target.value)}
            />
          </div>
        )}

        {/* Unspent */}
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

        {hasUnspentConvictions === "yes" && (
          <div>
            <Label>Unspent Conviction Details *</Label>
            <Textarea
              value={unspentDetails}
              onChange={(e) => setUnspentDetails(e.target.value)}
            />
          </div>
        )}

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
          <Input value={dbsNumber} onChange={(e) => setDbsNumber(e.target.value)} />
        </div>

        <div>
          <Label>CRB / DBS Expiry Date *</Label>
          <Input
            type="date"
            value={dbsExpiry}
            onChange={(e) => setDbsExpiry(e.target.value)}
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
