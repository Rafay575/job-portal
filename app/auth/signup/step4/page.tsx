"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GoAlert } from "react-icons/go";

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
    <div className="flex gap-2 mt-3">
      <Button type="button" variant="outline" onClick={handleBack}>
        Back
      </Button>
      <Button type="button" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
}

export default function Step4() {
  const [step] = useState(4);

  const [absentDays, setAbsentDays] = useState("");
  const [absencePeriods, setAbsencePeriods] = useState("");
  const [onMedication, setOnMedication] = useState("no");
  const [medicationDetails, setMedicationDetails] = useState("");
  const [healthTreatment, setHealthTreatment] = useState("no");
  const [treatmentDetails, setTreatmentDetails] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("no");
  const [conditionDetails, setConditionDetails] = useState("");
  const [disabled, setDisabled] = useState("no");
  const [impairmentType, setImpairmentType] = useState("");
  const [nightShiftFit, setNightShiftFit] = useState("yes");

  const validateStep = (): boolean => {
    return true;
  };

  return (
    <>
      <h2 className="text-primary text-3xl font-medium  mb-4 md:mb-7 text-center">
        Health Information (Optional)
      </h2>

      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Notice */}
        <div className="md:col-span-2 rounded-lg border p-2 text-sm text-muted-foreground">
          <p className="flex gap-1 font-medium">
            <GoAlert className="text-primary text-[15px] mt-0.5" />
            Health information is optional and processed under data protection
            regulations.
          </p>
        </div>

        <div>
          <Label>Absent days in last 3 years</Label>
          <Input value={absentDays} onChange={(e) => setAbsentDays(e.target.value)} />
        </div>

        <div>
          <Label>Number of absence periods in last 3 years</Label>
          <Input
            value={absencePeriods}
            onChange={(e) => setAbsencePeriods(e.target.value)}
          />
        </div>

        {/* Medication */}
        <div>
          <Label>Currently taking medication?</Label>
          <RadioGroup value={onMedication} onValueChange={setOnMedication}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="medYes" />
              <Label htmlFor="medYes">Yes</Label>
              <RadioGroupItem value="no" id="medNo" />
              <Label htmlFor="medNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {onMedication === "yes" && (
          <div>
            <Label>Medication Details</Label>
            <Textarea
              value={medicationDetails}
              onChange={(e) => setMedicationDetails(e.target.value)}
            />
          </div>
        )}

        {/* Treatment */}
        <div>
          <Label>Physical or mental health treatment?</Label>
          <RadioGroup value={healthTreatment} onValueChange={setHealthTreatment}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="treatYes" />
              <Label htmlFor="treatYes">Yes</Label>
              <RadioGroupItem value="no" id="treatNo" />
              <Label htmlFor="treatNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {healthTreatment === "yes" && (
          <div>
            <Label>Treatment Details</Label>
            <Textarea
              value={treatmentDetails}
              onChange={(e) => setTreatmentDetails(e.target.value)}
            />
          </div>
        )}

        {/* Condition */}
        <div>
          <Label>Any injury / condition / allergy affecting duties?</Label>
          <RadioGroup value={medicalCondition} onValueChange={setMedicalCondition}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="condYes" />
              <Label htmlFor="condYes">Yes</Label>
              <RadioGroupItem value="no" id="condNo" />
              <Label htmlFor="condNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {medicalCondition === "yes" && (
          <div>
            <Label>Condition Details</Label>
            <Textarea
              value={conditionDetails}
              onChange={(e) => setConditionDetails(e.target.value)}
            />
          </div>
        )}

        {/* Disability */}
        <div>
          <Label>Do you consider yourself disabled?</Label>
          <RadioGroup value={disabled} onValueChange={setDisabled}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="disYes" />
              <Label htmlFor="disYes">Yes</Label>
              <RadioGroupItem value="no" id="disNo" />
              <Label htmlFor="disNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {disabled === "yes" && (
          <div>
            <Label>Type of Impairment</Label>
            <Input
              value={impairmentType}
              onChange={(e) => setImpairmentType(e.target.value)}
            />
          </div>
        )}

        {/* Night */}
        <div>
          <Label>Medical fit for Night Shift?</Label>
          <RadioGroup value={nightShiftFit} onValueChange={setNightShiftFit}>
            <div className="flex gap-4 mt-2">
              <RadioGroupItem value="yes" id="nightYes" />
              <Label htmlFor="nightYes">Yes</Label>
              <RadioGroupItem value="no" id="nightNo" />
              <Label htmlFor="nightNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
    </>
  );
}
