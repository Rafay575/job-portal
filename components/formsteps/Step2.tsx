"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// ------------------ Types ------------------
import { Step2Type } from "@/types/Form";

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

// ------------------ Step 2 Component ------------------
export default function Step2({ next, back }: Props) {
  const [formData, setFormData] = useState<Step2Type>({
    availabilityIssue: "no",
    workRestrictions: "no",
    restrictionDetails: "",
    overtime: "yes",
    hoursAvoid: "",
    noticePeriod: "",
    workedBefore: "no",
    appliedBefore: "no",
    appliedDetails: "",
  });

  // Generic handler for all fields
  const handleChange = <K extends keyof Step2Type>(
    key: K,
    value: Step2Type[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validation
  const validateStep = (): boolean => {
    const {
      hoursAvoid,
      noticePeriod,
      workRestrictions,
      restrictionDetails,
      appliedBefore,
      appliedDetails,
    } = formData;

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
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Availability Issue */}
        <div>
          <Label>Involved in activity limiting availability?</Label>
          <RadioGroup
            value={formData.availabilityIssue}
            onValueChange={(v) =>
              handleChange("availabilityIssue", v as "yes" | "no")
            }
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
          <RadioGroup
            value={formData.overtime}
            onValueChange={(v) => handleChange("overtime", v as "yes" | "no")}
          >
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
            value={formData.hoursAvoid}
            onChange={(e) => handleChange("hoursAvoid", e.target.value)}
            placeholder="e.g. Nights"
            className="py-5"
          />
        </div>

        {/* Notice Period */}
        <div>
          <Label>Notice period required *</Label>
          <Input
            value={formData.noticePeriod}
            onChange={(e) => handleChange("noticePeriod", e.target.value)}
            placeholder="e.g. 2 weeks"
            className="py-5"
          />
        </div>

        {/* Applied Before */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Applied before?</Label>
            <RadioGroup
              value={formData.appliedBefore}
              onValueChange={(v) =>
                handleChange("appliedBefore", v as "yes" | "no")
              }
            >
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
            className={`transition-all duration-500 ease-in-out ${
              formData.appliedBefore === "yes"
                ? "h-auto! opacity-100"
                : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Application Details *</Label>
            <Textarea
              value={formData.appliedDetails}
              onChange={(e) => handleChange("appliedDetails", e.target.value)}
              placeholder="Provide details"
            />
          </div>
        </div>

        {/* Work Restrictions */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Subject to work restrictions / covenants?</Label>
            <RadioGroup
              value={formData.workRestrictions}
              onValueChange={(v) =>
                handleChange("workRestrictions", v as "yes" | "no")
              }
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
            className={`transition-all duration-500 ease-in-out ${
              formData.workRestrictions === "yes"
                ? "max-h-auto! opacity-100"
                : "max-h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Restriction Details *</Label>
            <Textarea
              value={formData.restrictionDetails}
              onChange={(e) =>
                handleChange("restrictionDetails", e.target.value)
              }
              placeholder="Provide details"
            />
          </div>
        </div>

        {/* Worked Before */}
        <div>
          <Label>Have you worked for us before?</Label>
          <RadioGroup
            value={formData.workedBefore}
            onValueChange={(v) =>
              handleChange("workedBefore", v as "yes" | "no")
            }
          >
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
      </div>

      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            console.log("Step2 Data:", formData); // ✅ log here
            next();
          }
        }}
      />
    </>
  );
}
