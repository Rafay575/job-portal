"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
=======
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db

type Props = {
  step: number;
  validateStep: () => boolean; // pass validation function
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
// reuse navigation component

export default function Step2() {
  const router = useRouter();
  const [step] = useState(2);

  // Step 2 fields
  const [availabilityIssue, setAvailabilityIssue] = useState("no");
  const [workRestrictions, setWorkRestrictions] = useState("no");
  const [restrictionDetails, setRestrictionDetails] = useState("");
  const [overtime, setOvertime] = useState("yes");
  const [hoursAvoid, setHoursAvoid] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [workedBefore, setWorkedBefore] = useState("no");
  const [appliedBefore, setAppliedBefore] = useState("no");
  const [appliedDetails, setAppliedDetails] = useState("");

  // Validation for Step 2
  const validateStep = (): boolean => {
    if (!hoursAvoid || !noticePeriod) {
      toast.error("Please complete all required fields");
      return false;
    }

    if (workRestrictions === "yes" && !restrictionDetails) {
      toast.error("Please provide restriction details");
      return false;
    }

    if (appliedBefore === "yes" && !appliedDetails) {
      toast.error("Please provide application details");
      return false;
    }

    return true;
  };

  return (
    <>
<<<<<<< HEAD
      <h2 className="text-primary text-3xl font-medium italic mb-4 md:mb-7 text-center">
        Pre-Qualifying Questions
      </h2>

=======
      
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1  grid-cols-1 md:grid-cols-2 ">
        {/* Availability Issue */}
        <div>
          <Label>Involved in activity limiting availability?</Label>
          <RadioGroup
            value={availabilityIssue}
            onValueChange={setAvailabilityIssue}
          >
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="availabilityYes" />
                <Label htmlFor="availabilityYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="availabilityNo" />
                <Label htmlFor="availabilityNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Work Restrictions */}
        <div>
          <Label>Subject to work restrictions / covenants?</Label>
          <RadioGroup
            value={workRestrictions}
            onValueChange={setWorkRestrictions}
          >
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="restrictYes" />
                <Label htmlFor="restrictYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="restrictNo" />
                <Label htmlFor="restrictNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {workRestrictions === "yes" && (
          <>
            <div>
              <Label>Restriction Details *</Label>
              <Textarea
                value={restrictionDetails}
                onChange={(e) => setRestrictionDetails(e.target.value)}
                placeholder="Provide details"
              />
            </div>
          </>
        )}

        {/* Overtime */}
        <div>
          <Label>Willing to work overtime & weekends?</Label>
          <RadioGroup value={overtime} onValueChange={setOvertime}>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="overtimeYes" />
                <Label htmlFor="overtimeYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="overtimeNo" />
                <Label htmlFor="overtimeNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Hours Avoid */}
        <div>
          <Label>Hours you do not wish to work *</Label>
          <Input
            value={hoursAvoid}
            onChange={(e) => setHoursAvoid(e.target.value)}
            placeholder="e.g. Nights"
            className="py-5"
          />
        </div>

        {/* Notice Period */}
        <div>
          <Label>Notice period required *</Label>
          <Input
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            placeholder="e.g. 2 weeks"
            className="py-5"
          />
        </div>

        {/* Worked Before */}
        <div>
          <Label>Have you worked for us before?</Label>
          <RadioGroup value={workedBefore} onValueChange={setWorkedBefore}>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="workedYes" />
                <Label htmlFor="workedYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="workedNo" />
                <Label htmlFor="workedNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Applied Before */}
        <div>
          <Label>Applied before?</Label>
          <RadioGroup value={appliedBefore} onValueChange={setAppliedBefore}>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="appliedYes" />
                <Label htmlFor="appliedYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="appliedNo" />
                <Label htmlFor="appliedNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {appliedBefore === "yes" && (
          <div>
            <Label>Application Details *</Label>
            <Textarea
              value={appliedDetails}
              onChange={(e) => setAppliedDetails(e.target.value)}
              placeholder="Provide details"
            />
          </div>
        )}

        {/* Navigation Buttons */}
      </div>
        <SignupNavButtons step={step} validateStep={validateStep} />
    </>
  );
}
