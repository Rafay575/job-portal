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
import { submitStep4, getStep4 } from "@/lib/api/step4";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import Link from "next/link";

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

// ------------------ Step 4 Component ------------------
export default function Step4({ next, back }: Props) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<Step4Type>({
    absentDays: "",
    onMedication: null,
    medicationDetails: "",
    healthTreatment: null,
    treatmentDetails: "",
    medicalCondition: null,
    conditionDetails: "",
    disabled: null,
    impairmentType: "",
    nightShiftFit: null,
  });

  const handleChange = <K extends keyof Step4Type>(
    key: K,
    value: Step4Type[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    return true;
  };

  const router = useRouter();
  useEffect(() => {
    const verifyUser = async () => {
      if (!user.id) {
        toast.error("Id not found  ");
        router.push("/");
        return;
      }
      const isApproved = await checkApproval(user.id);

      if (!isApproved) {
        setBlur(true);
      }
    };

    verifyUser();
    const fetchStep4 = async () => {
      setLoading(true);

      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }

      const res = await getStep4(user.id);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          absentDays: d.absent_days || "",
          onMedication: Boolean(d.on_medication),
          medicationDetails: d.medication_details || "",
          healthTreatment: Boolean(d.health_treatment),
          treatmentDetails: d.treatment_details || "",
          medicalCondition: Boolean(d.medical_condition),
          conditionDetails: d.condition_details || "",
          disabled: Boolean(d.disabled),
          impairmentType: d.impairment_type || "",
          nightShiftFit: Boolean(d.night_shift_fit),
        });
      }
      setLoading(false);
    };

    fetchStep4();
  }, []);

  const handleSubmitStep4 = async () => {
    try {
      setLoading(true);
      const res = await submitStep4({
        userId: user.id,
        absentDays: formData.absentDays,
        onMedication: formData.onMedication,
        medicationDetails: formData.medicationDetails,
        healthTreatment: formData.healthTreatment,
        treatmentDetails: formData.treatmentDetails,
        medicalCondition: formData.medicalCondition,
        conditionDetails: formData.conditionDetails,
        disabled: formData.disabled,
        impairmentType: formData.impairmentType,
        nightShiftFit: formData.nightShiftFit,
      });

      if (res.success) {
        toast.success(res.data?.message || "Step 4 saved successfully!");
        next();
      } else {
        toast.error(res.message || "Failed to save Step 4");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <FullPageLoader />;

  return (
    <div className="relative px-2">
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
      >
        <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
          {/* Notice */}
          <div className="md:col-span-2 rounded-sm border p-2 px-3 text-sm text-white bg-primary">
            <p className="flex gap-3 font-medium ">
              <GoAlert className=" text-[17px] mt-0.5 text-white" />
              Health information is optional and processed under data protection
              regulations.
            </p>
          </div>

          {/* Medication */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>Currently taking medication?</Label>
              <RadioGroup
                value={formData.onMedication ? "yes" : "no"}
                onValueChange={(v) => handleChange("onMedication", v === "yes")}
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
                formData.onMedication
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>Medication Details</Label>
              <Textarea
                value={formData.medicationDetails}
                onChange={(e) =>
                  handleChange("medicationDetails", e.target.value)
                }
              />
            </div>
          </div>

          {/* Treatment */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>
                Are you taking any physical or mental health treatment?
              </Label>
              <RadioGroup
                value={formData.healthTreatment ? "yes" : "no"}
                onValueChange={(v) =>
                  handleChange("healthTreatment", v === "yes")
                }
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
                formData.healthTreatment
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>Treatment Details</Label>
              <Textarea
                value={formData.treatmentDetails}
                onChange={(e) =>
                  handleChange("treatmentDetails", e.target.value)
                }
              />
            </div>
          </div>

          {/* Condition */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>
                Any medical condition that can affecting your duties?
              </Label>
              <RadioGroup
                value={formData.medicalCondition ? "yes" : "no"}
                onValueChange={(v) =>
                  handleChange("medicalCondition", v === "yes")
                }
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
                formData.medicalCondition
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>Condition Details</Label>
              <Textarea
                value={formData.conditionDetails}
                onChange={(e) =>
                  handleChange("conditionDetails", e.target.value)
                }
              />
            </div>
          </div>

          {/* Disability */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>Do you consider yourself disabled?</Label>
              <RadioGroup
                value={formData.disabled ? "yes" : "no"}
                onValueChange={(v) => handleChange("disabled", v === "yes")}
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
                formData.disabled
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>Type of Impairment</Label>
              <Input
                value={formData.impairmentType}
                onChange={(e) => handleChange("impairmentType", e.target.value)}
              />
            </div>
          </div>

          {/* Absent Days */}
          <div>
            <Label>How many sick leaves you had in last 3 years</Label>
            <Input
              value={formData.absentDays}
              onChange={(e) => handleChange("absentDays", e.target.value)}
            />
          </div>

          {/* Night Shift */}
          <div>
            <Label>Are you medically fit for the Night Shift?</Label>
            <RadioGroup
              value={formData.nightShiftFit ? "yes" : "no"}
              onValueChange={(v) => handleChange("nightShiftFit", v === "yes")}
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

        <SignupNavButtons onBack={back} onNext={handleSubmitStep4} />
      </div>

      {/* Overlay */}
      {blur && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Appliaction Submitted Successfully.
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              One of our representative will get back to you with in 24 to 48
              hours.
            </p>

            {/* Optional action */}
            <div className="flex justify-evenly items-center">
              <Link href={"/"}>
                <button className="px-6 py-1 bg-primary text-white rounded text-[15px] flex gap-1 items-center">
                  Done
                  {/* <IoMdCheckmark className="size-5 mb-0.5"/> */}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
