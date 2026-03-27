"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GoAlert } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step4Type } from "@/types/Form";


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

// ------------------ Step 4 Component ------------------
export default function Step4({ next, back }: Props) {
  const [formData, setFormData] = useState<Step4Type>({
    absentDays: "",
    absencePeriods: "",
    onMedication: "no",
    medicationDetails: "",
    healthTreatment: "no",
    treatmentDetails: "",
    medicalCondition: "no",
    conditionDetails: "",
    disabled: "no",
    impairmentType: "",
    nightShiftFit: "yes",
  });

  const handleChange = <K extends keyof Step4Type>(key: K, value: Step4Type[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    // Placeholder: health info is optional, so always true
    return true;
  };

  return (
    <>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Notice */}
        <div className="md:col-span-2 rounded-lg border p-2 text-sm text-muted-foreground">
          <p className="flex gap-1 font-medium">
            <GoAlert className="text-primary text-[15px] mt-0.5" />
            Health information is optional and processed under data protection regulations.
          </p>
        </div>

        {/* Absent Days */}
        <div>
          <Label>Absent days in last 3 years</Label>
          <Input
            value={formData.absentDays}
            onChange={(e) => handleChange("absentDays", e.target.value)}
          />
        </div>

        <div>
          <Label>Number of absence periods in last 3 years</Label>
          <Input
            value={formData.absencePeriods}
            onChange={(e) => handleChange("absencePeriods", e.target.value)}
          />
        </div>

        {/* Medication */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Currently taking medication?</Label>
            <RadioGroup
              value={formData.onMedication}
              onValueChange={(v) => handleChange("onMedication", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="medYes" />
                <Label htmlFor="medYes">Yes</Label>
                <RadioGroupItem value="no" id="medNo" />
                <Label htmlFor="medNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.onMedication === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Medication Details</Label>
            <Textarea
              value={formData.medicationDetails}
              onChange={(e) => handleChange("medicationDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Treatment */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Physical or mental health treatment?</Label>
            <RadioGroup
              value={formData.healthTreatment}
              onValueChange={(v) => handleChange("healthTreatment", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="treatYes" />
                <Label htmlFor="treatYes">Yes</Label>
                <RadioGroupItem value="no" id="treatNo" />
                <Label htmlFor="treatNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.healthTreatment === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Treatment Details</Label>
            <Textarea
              value={formData.treatmentDetails}
              onChange={(e) => handleChange("treatmentDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Condition */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Any injury / condition / allergy affecting duties?</Label>
            <RadioGroup
              value={formData.medicalCondition}
              onValueChange={(v) => handleChange("medicalCondition", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="condYes" />
                <Label htmlFor="condYes">Yes</Label>
                <RadioGroupItem value="no" id="condNo" />
                <Label htmlFor="condNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.medicalCondition === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Condition Details</Label>
            <Textarea
              value={formData.conditionDetails}
              onChange={(e) => handleChange("conditionDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Disability */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Do you consider yourself disabled?</Label>
            <RadioGroup
              value={formData.disabled}
              onValueChange={(v) => handleChange("disabled", v as "yes" | "no")}
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="disYes" />
                <Label htmlFor="disYes">Yes</Label>
                <RadioGroupItem value="no" id="disNo" />
                <Label htmlFor="disNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              formData.disabled === "yes" ? "h-auto! opacity-100" : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Type of Impairment</Label>
            <Input
              value={formData.impairmentType}
              onChange={(e) => handleChange("impairmentType", e.target.value)}
            />
          </div>
        </div>

        {/* Night Shift */}
        <div>
          <Label>Medical fit for Night Shift?</Label>
          <RadioGroup
            value={formData.nightShiftFit}
            onValueChange={(v) => handleChange("nightShiftFit", v as "yes" | "no")}
          >
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="nightYes" />
              <Label htmlFor="nightYes">Yes</Label>
              <RadioGroupItem value="no" id="nightNo" />
              <Label htmlFor="nightNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <SignupNavButtons
        onBack={back}
        onNext={() => {
          if (validateStep()) {
            console.log("Step4 Data:", formData); // ✅ log here
            next();
          }
        }}
      />
    </>
  );
}