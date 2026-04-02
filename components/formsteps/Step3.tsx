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
import { useEffect } from "react";
import { getStep3 } from "@/lib/api/step3";
import { submitStep3 } from "@/lib/api/step3";
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

// ------------------ Step 3 Component ------------------
export default function Step3({ next, back }: Props) {
  const user = useSelector((state: RootState) => state.user);

  const [existingCRB, setExistingCRB] = useState<string>();
  const [formData, setFormData] = useState<Step3Type>({
    hasConvictions: false,
    convictionDetails: "",
    hasUnspentConvictions: false,
    unspentDetails: "",
    fitnessInvestigation: false,
    removedFromRegister: false,
    crb: false,
    surname: "",
    dob: "",
    crbFile: null,
  });

  const handleChange = <K extends keyof Step3Type>(
    key: K,
    value: Step3Type[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    if (formData.hasConvictions && !formData.convictionDetails) {
      toast.error("Please provide conviction details");
      return false;
    }

    if (formData.hasUnspentConvictions && !formData.unspentDetails) {
      toast.error("Please provide unspent conviction details");
      return false;
    }

    if (formData.crb) {
      if (!formData.surname) {
        toast.error("Surname is required");
        return false;
      }

      if (!formData.dob) {
        toast.error("Date of birth is required");
        return false;
      }

      if (!formData.crbFile && !existingCRB) {
        toast.error("Please upload CRB document");
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user.id) {
        toast.error("Id not found in useEffect")
        return
      };
      const res = await getStep3(user.id);

      if (res.success && res.data[0]) {
        const d = res.data[0];

        setFormData({
          hasConvictions: Boolean(d.has_convictions),
          convictionDetails: d.conviction_details || "",
          hasUnspentConvictions: Boolean(d.has_unspent_convictions),
          unspentDetails: d.unspent_details || "",
          fitnessInvestigation: Boolean(d.fitness_investigation),
          removedFromRegister: Boolean(d.removed_from_register),
          crb: Boolean(d.crb),
          surname: d.surname || "",
          dob: d.dob ? d.dob.split("T")[0] : "",
          crbFile: null, // important
        });

        setExistingCRB(d.crb_file_path);
      }
    };

    fetchData();
  }, []);

  const handleSubmitStep3 = async () => {
    if (!validateStep()) return;

    try {
      const form = new FormData();

      form.append("userId", String(user.id));
      form.append("hasConvictions", String(formData.hasConvictions));
      form.append("convictionDetails", formData.convictionDetails);

      form.append(
        "hasUnspentConvictions",
        String(formData.hasUnspentConvictions),
      );
      form.append("unspentDetails", formData.unspentDetails);

      form.append(
        "fitnessInvestigation",
        String(formData.fitnessInvestigation),
      );

      form.append("removedFromRegister", String(formData.removedFromRegister));

      form.append("crb", String(formData.crb));
      form.append("surname", formData.surname);
      form.append("dob", formData.dob);

      if (formData.crbFile) {
        form.append("crbFile", formData.crbFile);
      }

      const res = await submitStep3(form);

      if (res.success) {
        toast.success(res.data?.message || "Step 3 saved!");
        next();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        {/* Convictions */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Any convictions?</Label>
            <RadioGroup
              value={formData.hasConvictions ? "yes" : "no"}
              onValueChange={(v) => handleChange("hasConvictions", v === "yes")}
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
              formData.hasConvictions
                ? "h-auto! opacity-100"
                : "h-0! overflow-hidden! opacity-0"
            }`}
          >
            <Label>Conviction Details *</Label>
            <Textarea
              value={formData.convictionDetails}
              onChange={(e) =>
                handleChange("convictionDetails", e.target.value)
              }
            />
          </div>
        </div>

        {/* Unspent Convictions */}
        <div className="flex flex-col items-stretch gap-4">
          <div>
            <Label>Any unspent convictions?</Label>
            <RadioGroup
              value={formData.hasUnspentConvictions ? "yes" : "no"}
              onValueChange={(v) =>
                handleChange("hasUnspentConvictions", v === "yes")
              }
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
              formData.hasUnspentConvictions
                ? "h-auto! opacity-100"
                : "h-0! overflow-hidden! opacity-0"
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
            value={formData.fitnessInvestigation ? "yes" : "no"}
            onValueChange={(v) =>
              handleChange("fitnessInvestigation", v === "yes")
            }
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
            value={formData.removedFromRegister ? "yes" : "no"}
            onValueChange={(v) =>
              handleChange("removedFromRegister", v === "yes")
            }
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
              value={formData.crb ? "yes" : "no"}
              onValueChange={(v) => handleChange("crb", v === "yes")}
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
              formData.crb
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
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleChange("crbFile", e.target.files[0]);
                      setExistingCRB(undefined); // 🔥 same as CV
                    }
                  }}
                />
                {existingCRB && (
                  <a href={existingCRB} target="_blank">
                    <Button type="button" className="mt-2" size="sm">
                      View Existing CRB
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupNavButtons onBack={back} onNext={handleSubmitStep3} />
    </>
  );
}
