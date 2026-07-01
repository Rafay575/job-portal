"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
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
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { IoRefresh } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
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
const checkApproval = async (userId: number | string) => {
  try {
    const res = await fetch(`/api/users/check-approval?id=${userId}`);
    const data = await res.json();
    return data.isApproved;
  } catch (error) {
    return false;
  }
};

// ------------------ Step 2 Component ------------------
export default function Step2({ next, back }: Props) {
  const [blur, setBlur] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<Step2Type>({
    availabilityIssue: null,
    workRestrictions: null,
    restrictionDetails: "",
    overtime: null,
    hoursAvoid: "",
    noticePeriod: "",
    workedBefore: null,
    appliedBefore: null,
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
    if (!validateStep()) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
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

    const fetchStep2 = async () => {
      setLoading(true);
      if (!user.id) {
        toast.error("Id not found ");
        return;
      }

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
      setLoading(false);
    };

    fetchStep2();
  }, []);
  if (loading) return <FullPageLoader />;
  return (
    <>
      <div className="relative px-2">
        <div
          className={
            blur ? "blur-[3px] pointer-events-none select-none p-2" : ""
          }
        >
          <div className="min-w-full space-y-5  grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
            {/* Availability Issue */}
            <div>
              <Label >
                <span>Are you involved in any activities that limit your work availibility? <span className="text-red-500">*</span></span> 
              </Label>
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
              <Label>
                <span>Willing to work overtime & weekends?<span className="text-red-500">*</span></span>
              </Label>
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
              <Label>
                <span>Hours you do not wish to work<span className="text-red-500">*</span></span>
              </Label>
              <Input
                value={formData.hoursAvoid}
                onChange={(e) => handleChange("hoursAvoid", e.target.value)}
                className="py-5"
              />
            </div>

            {/* Notice Period */}
            <div>
              <Label>
                <span>Notice period required <span className="text-red-500">*</span></span>
              </Label>
              <Input
                value={formData.noticePeriod}
                onChange={(e) => handleChange("noticePeriod", e.target.value)}
                className="py-5"
              />
            </div>

            {/* Applied Before */}
            <div className="flex flex-col items-stretch gap-4">
              <div>
                <Label>
                  <span>Applied before?<span className="text-red-500">*</span></span>
                </Label>
                <RadioGroup
                  value={formData.appliedBefore ? "yes" : "no"}
                  onValueChange={(v) =>
                    handleChange("appliedBefore", v === "yes")
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
                  formData.appliedBefore === true
                    ? "h-auto! opacity-100"
                    : "h-0! overflow-hidden! opacity-0"
                }`}
              >
                <Label>
                  <span>Application Details <span className="text-red-500">*</span></span>
                </Label>
                <Textarea
                  value={formData.appliedDetails}
                  onChange={(e) =>
                    handleChange("appliedDetails", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Work Restrictions */}
            <div className="flex flex-col items-stretch gap-4">
              <div>
                <Label>
                  <span>Subject to work restrictions / covenants?<span className="text-red-500">*</span></span>
                </Label>
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
                <Label>
                  <span>Restriction Details <span className="text-red-500">*</span></span>
                </Label>
                <Textarea
                  value={formData.restrictionDetails}
                  onChange={(e) =>
                    handleChange("restrictionDetails", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Worked Before */}
            <div>
              <Label>
                <span>Have you worked for us before?
                <span className="text-red-500">*</span></span>
              </Label>
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
    </>
  );
}
