"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Step5Type } from "@/types/Form";
import { submitStep5, getStep5 } from "@/lib/api/step5";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/usersApproval";

// ------------------ Types ------------------

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

// ------------------ Step 5 Component ------------------
export default function Step5({ next, back }: Props) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<Step5Type>({
    isNurse: null,
    professionalBody: "",
    registrationType: "",
    registrationNumber: "",
    registrationExpiry: "",
  });

  // ------------------ Handle Change ------------------
  const handleChange = <K extends keyof Step5Type>(
    key: K,
    value: Step5Type[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ------------------ Prefetch Existing Data ------------------
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
    const fetchStep5 = async () => {
      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);

      const res = await getStep5(user.id);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          isNurse: Boolean(d.is_nurse),
          professionalBody: d.professional_body || "",
          registrationType: d.registration_type || "",
          registrationNumber: d.registration_number || "",
          registrationExpiry: d.registration_expiry
            ? d.registration_expiry.split("T")[0]
            : "",
        });
      }
      setLoading(false);
    };

    fetchStep5();
  }, []);

  // ------------------ Validation ------------------
  const validateStep = (): boolean => {
    if (formData.isNurse) {
      if (
        !formData.professionalBody ||
        !formData.registrationType ||
        !formData.registrationNumber ||
        !formData.registrationExpiry
      ) {
        toast.error("Please complete all professional registration fields");
        return false;
      }
    }
    return true;
  };

  // ------------------ Submit Step 5 ------------------
  const handleSubmitStep5 = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      const res = await submitStep5({
        userId: user.id,
        isNurse: formData.isNurse,
        professionalBody: formData.professionalBody,
        registrationType: formData.registrationType,
        registrationNumber: formData.registrationNumber,
        registrationExpiry: formData.registrationExpiry,
      });

      if (res.success) {
        toast.success(res.data?.message || "Step 5 saved successfully!");
        next();
      } else {
        toast.error(res.message || "Failed to save Step 5");
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
    <div className="relative min-h-[250px]">
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
      >
        {/* Nurse Radio */}
        <div className="col-span-2 mb-2">
          <Label>Are you a Nurse?</Label>

          <RadioGroup
            value={
              formData.isNurse === null
                ? undefined
                : formData.isNurse
                  ? "yes"
                  : "no"
            }
            onValueChange={(v) => handleChange("isNurse", v === "yes")}
          >
            <div className="flex gap-4 mt-2 items-center">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="nurseYes" />
                <Label htmlFor="nurseYes">Yes</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="nurseNo" />
                <Label htmlFor="nurseNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Conditional Fields */}
        <div
          className={`min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2 transition-all duration-500 ease-in-out ${
            formData.isNurse
              ? "opacity-100 max-h-[500px]"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div>
            <Label>
              Professional Body Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.professionalBody}
              onChange={(e) => handleChange("professionalBody", e.target.value)}
            />
          </div>

          <div>
            <Label>
              Registration Type <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.registrationType}
              onChange={(e) => handleChange("registrationType", e.target.value)}
            />
          </div>

          <div>
            <Label>
              Registration / PIN Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.registrationNumber}
              onChange={(e) =>
                handleChange("registrationNumber", e.target.value)
              }
            />
          </div>

          <div>
            <Label>
              Expiry Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.registrationExpiry}
              onChange={(e) =>
                handleChange("registrationExpiry", e.target.value)
              }
            />
          </div>
        </div>

        {/* Navigation */}
        <SignupNavButtons onBack={back} onNext={handleSubmitStep5} />
      </div>

      {/* Overlay */}
      {blur && (
        <div className="absolute inset-0 flex items-center justify-center  z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Appliaction Approval Pending
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your appliaction is under review. You’ll gain full access once
              approved and will let you know by email.
            </p>

            {/* Optional action */}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1 bg-primary text-white rounded-full"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
