"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { submitStep2 } from "@/lib/api/step2";
import { getStep2 } from "@/lib/api/step2";
import { useEffect } from "react";
import { Step2Type } from "@/types/Form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
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
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<Step2Type>({
    availabilityIssue: false,
    workRestrictions: false,
    restrictionDetails: "",
    overtime: true,
    hoursAvoid: "",
    noticePeriod: "",
    workedBefore: false,
    appliedBefore: false,
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

    if (workRestrictions && !restrictionDetails) {
      toast.error("Please provide restriction details");
      return false;
    }

    if (appliedBefore && !appliedDetails) {
      toast.error("Please provide application details");
      return false;
    }

    return true;
  };

  const handleSubmitStep2 = async () => {
    // 1. validate first
    if (!validateStep()) return;

    try {
      // 2. API CALL
      const res = await submitStep2({
        userId: user.id, // replace later with real user id
        availabilityIssue: formData.availabilityIssue,
        overtime: formData.overtime,
        hoursAvoid: formData.hoursAvoid,
        noticePeriod: formData.noticePeriod,
        appliedBefore: formData.appliedBefore,
        appliedDetails: formData.appliedDetails,
        workRestrictions: formData.workRestrictions,
        restrictionDetails: formData.restrictionDetails,
        workedBefore: formData.workedBefore,
      });

      // 3. handle response
      if (res.success) {
        toast.success(res.data?.message || "Step 2 submitted successfully!");
        next();
      } else {
        toast.error(res.message || "Failed to submit Step 2");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const fetchStep2 = async () => {
      if (!user.id) {
        toast.error("Id not found in useEffect")
        return
      };

      const res = await getStep2(user.id);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          availabilityIssue: Boolean(d.availability_issue),
          overtime: Boolean(d.overtime),
          hoursAvoid: d.hours_avoid || "",
          noticePeriod: d.notice_period || "",
          appliedBefore: Boolean(d.applied_before),
          appliedDetails: d.applied_details || "",
          workRestrictions: Boolean(d.work_restrictions),
          restrictionDetails: d.restriction_details || "",
          workedBefore: Boolean(d.worked_before),
        });
      }
    };

    fetchStep2();
  }, []);
  return (
    <>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Availability Issue */}
        <div>
          <Label>Involved in activity limiting availability?</Label>
          <RadioGroup
            value={formData.availabilityIssue ? "yes" : "no"}
            onValueChange={(v) =>
              handleChange("availabilityIssue", v === "yes")
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
            value={formData.overtime ? "yes" : "no"}
            onValueChange={(v) => handleChange("overtime", v === "yes")}
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
              value={formData.appliedBefore ? "yes" : "no"}
              onValueChange={(v) => handleChange("appliedBefore", v === "yes")}
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
              formData.appliedBefore === true
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
              value={formData.workRestrictions ? "yes" : "no"}
              onValueChange={(v) =>
                handleChange("workRestrictions", v === "yes")
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
              formData.workRestrictions === true
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
            value={formData.workedBefore ? "yes" : "no"}
            onValueChange={(v) => handleChange("workedBefore", v === "yes")}
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

      <SignupNavButtons onBack={back} onNext={handleSubmitStep2} />
    </>
  );
}
