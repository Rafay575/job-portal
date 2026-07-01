"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Step1FullTimeType } from "@/types/Form";
import { submitStep1 } from "@/lib/api/step1";
import { useEffect } from "react";
import { getStep1 } from "@/lib/api/step1";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { DocCard } from "../common/DocCard";

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  type: string;
  disableBack?: boolean;
};

function SignupNavButtons({ onNext, onBack, type, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 mt-3 justify-between">
      {type !== "permanent" && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={disableBack}
        >
          <IoIosArrowBack />
          Back
        </Button>
      )}

      <Button type="button" onClick={onNext} className="ml-auto">
        {type == "permanent" ? "Submit" : "Next"}
        {type !== "permanent" && <IoIosArrowForward />}
      </Button>
    </div>
  );
}

type Props = {
  type: string;
  next: () => void;
  back: () => void;
  roleType: string;
};

export default function Step1FullTime({ type, next, back, roleType }: Props) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<Step1FullTimeType>({
    type: type,
    fullName: user.name || "",
    email: user.email || "",
    phone: "",
    address: "",
    postcode: "",
    nationality: "",
    immigrationStatus: "",
    immigrationExpiry: "",
    workPermit: null,
    nameChanged: null,
    previousName: "",
    changedTo: "",
    userId: user.id,
    cvFile: null,
  });

  const handleChange = <K extends keyof Step1FullTimeType>(
    key: K,
    value: Step1FullTimeType[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    const {
      fullName,
      email,
      phone,
      address,
      postcode,
      nationality,
      immigrationStatus,
      immigrationExpiry,
      nameChanged,
      previousName,
      changedTo,
      userId,
      cvFile,
    } = formData;

    if (!userId) {
      toast.error("userId is missing");
      return false;
    }
    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !postcode ||
      !nationality ||
      !immigrationStatus ||
      !immigrationExpiry
    ) {
      toast.error("Please complete all required fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address");
      return false;
    }

    if (!/^[0-9+]{7,15}$/.test(phone)) {
      toast.error("Invalid phone number");
      return false;
    }

    if (nameChanged) {
      if (!previousName || !changedTo) {
        toast.error("Please provide previous name details");
        return false;
      }
    }

    if (roleType === "permanent" || roleType === "both") {
      if (!cvFile) {
        toast.error("Please upload your CV");
        return false;
      }
    }

    return true;
  };
  const formatDate = (date: string) => {
    if (!date) return "";
    return date.split("T")[0]; // removes time part
  };
  const handleSubmitStep1 = async () => {
    // 1. Validate first
    if (!validateStep()) return;

    setLoading(true);
    try {
      // 2. Create FormData
      const form = new FormData();
      form.append("userId", String(formData.userId));
      form.append("type", String(type));
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("postcode", formData.postcode);
      form.append("nationality", formData.nationality);
      form.append("immigrationStatus", formData.immigrationStatus);
      form.append("immigrationExpiry", formData.immigrationExpiry);
      form.append("workPermit", String(formData.workPermit));
      form.append("nameChanged", String(formData.nameChanged));

      if (formData.previousName) {
        form.append("previousName", formData.previousName);
      }

      if (formData.changedTo) {
        form.append("changedTo", formData.changedTo);
      }

      if (formData.cvFile instanceof File) {
        form.append("cvFile", formData.cvFile);
      }

      form.append("roleType", roleType);

      const res = await submitStep1(form);

      // 4. Handle response
      if (res.success) {
        toast.success(res.data?.message || "Step 1 submitted successfully!");

        next();
      } else {
        toast.error(res.message || "Failed to submit Step 1");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getStep1(user.id);
      if (res.success && res.data[0]) {
        const d = res.data[0];
        setFormData({
          userId: user.id,
          type: type,
          fullName: user.name || d.full_name || "",
          email: user.email || d.email || "",
          phone: d.phone || "",
          address: d.address || "",
          postcode: d.postcode || "",
          nationality: d.nationality || "",
          immigrationStatus: d.immigration_status || "",
          immigrationExpiry: formatDate(d.immigration_expiry) || "",
          workPermit: Boolean(d.work_permit),
          nameChanged: Boolean(d.name_changed),
          previousName: d.previous_name || "",
          changedTo: d.changed_to || "",
          cvFile: d.cv_file_path || null,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <FullPageLoader />;
  return (
    <>
      <div className="min-w-full space-y-5  grid gap-x-5 gap-y-1  grid-cols-1 md:grid-cols-2 px-2">
        <div>
          <Label>
            <span>
              Full Name <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            readOnly
            disabled
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Email Address <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            readOnly
            disabled
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Phone Number <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Current Address <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Postcode <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Nationality <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Immigration Status <span className="text-red-500">*</span>
            </span>
          </Label>
          <div className="border rounded-lg border-[#f0f0f0]">
            <Select
              value={formData.immigrationStatus}
              onValueChange={(value) =>
                handleChange("immigrationStatus", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="citizen">UK Citizen</SelectItem>
                <SelectItem value="settled">Settled Status</SelectItem>
                <SelectItem value="pre-settled">Pre-Settled</SelectItem>
                <SelectItem value="visa">Work Visa</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>
            <span>
              Immigration Expiry Date <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            type="date"
            value={formData.immigrationExpiry ?? ""}
            onChange={(e) => handleChange("immigrationExpiry", e.target.value)}
          />
        </div>

        <div>
          <Label>
            <span>
              Do you need a UK Work Permit?
              <span className="text-red-500">*</span>
            </span>
          </Label>
          <RadioGroup
            value={formData.workPermit ? "yes" : "no"}
            onValueChange={(value) =>
              handleChange("workPermit", value === "yes")
            }
          >
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="permitYes" />
                <Label htmlFor="permitYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="permitNo" />
                <Label htmlFor="permitNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>
            <span>
              Have you changed your name before?
              <span className="text-red-500">*</span>
            </span>
          </Label>
          <RadioGroup
            value={formData.nameChanged ? "yes" : "no"}
            onValueChange={(value) =>
              handleChange("nameChanged", value === "yes")
            }
          >
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="nameYes" />
                <Label htmlFor="nameYes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="nameNo" />
                <Label htmlFor="nameNo">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out  ${
            formData.nameChanged
              ? "h-auto!  opacity-100 "
              : "h-0! overflow-hidden!  opacity-0 "
          }`}
        >
          <Label>
            <span>
              Previous Name <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.previousName}
            onChange={(e) => handleChange("previousName", e.target.value)}
          />
        </div>

        <div
          className={`transition-all duration-500 ease-in-out  ${
            formData.nameChanged
              ? "h-auto!  opacity-100 "
              : "h-0! overflow-hidden!  opacity-0 "
          }`}
        >
          <Label>
            <span>
              Changed To <span className="text-red-500">*</span>
            </span>
          </Label>
          <Input
            value={formData.changedTo}
            onChange={(e) => handleChange("changedTo", e.target.value)}
          />
        </div>

        <div
          className={`${
            roleType === "permanent" || roleType === "both"
              ? "h-auto!  opacity-100 "
              : "h-0! overflow-hidden!  opacity-0 "
          } transition-all duration-500 ease-in-out   md:col-span-2`}
        >
          <Label>
            <span>
              Upload CV <span className="text-red-500">*</span>
            </span>
          </Label>

          <DocCard<Step1FullTimeType>
            title="Curriculum Vitae (CV)"
            fieldKey="cvFile"
            hint="Upload your CV (PDF, DOC or DOCX)"
            file={formData.cvFile}
            onUpdate={handleChange}
            acceptedTypes={[".pdf", ".doc", ".docx" ]}
          /> 
        </div>
      </div>

      <SignupNavButtons
        disableBack
        onBack={back}
        onNext={handleSubmitStep1}
        type={type}
      />
    </>
  );
}
