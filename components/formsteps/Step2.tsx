"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
export default function Step2({ next, back }: Props) {
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

        {/* Applied Before */}
        <div className="flex flex-col items-stretch gap-4 ">
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

          <div
            className={`transition-all duration-500 ease-in-out  ${appliedBefore === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}
          >
            <Label>Application Details *</Label>
            <Textarea
              value={appliedDetails}
              onChange={(e) => setAppliedDetails(e.target.value)}
              placeholder="Provide details"
              className=""
            />
          </div>
        </div>

        {/* Work Restrictions */}
        <div className="flex flex-col items-stretch gap-4 ">
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

          <div
            className={`transition-all duration-500 ease-in-out  ${workRestrictions === "yes" ? "max-h-auto!  opacity-100 " : "max-h-0! overflow-hidden!  opacity-0"}`}
          >
            <Label>Restriction Details *</Label>
            <Textarea
              value={restrictionDetails}
              onChange={(e) => setRestrictionDetails(e.target.value)}
              placeholder="Provide details"
            />
          </div>
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
        {/* Navigation Buttons */}
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
