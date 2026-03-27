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
import { toast } from "sonner";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Step1FullTimeType } from "@/types/Form";

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

export default function Step1({ next, back }: Props) {
  const [formData, setFormData] = useState<Step1FullTimeType>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    nationality: "",
    immigrationStatus: "",
    immigrationExpiry: "",
    workPermit: "no",
    nameChanged: "no",
    previousName: "",
    changedTo: "",
  });

  const handleChange = <K extends keyof Step1FullTimeType>(
    key: K,
    value: Step1FullTimeType[K]
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
    } = formData;

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

    if (nameChanged === "yes") {
      if (!previousName || !changedTo) {
        toast.error("Please provide previous name details");
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
        <div>
          <Label>Full Name *</Label>
          <Input
            value={formData.fullName}
            placeholder="John Smith"
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div>
          <Label>Email Address *</Label>
          <Input
            value={formData.email}
            placeholder="example@gmail.com"
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label>Phone Number *</Label>
          <Input
            value={formData.phone}
            placeholder="923254412292"
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <Label>Current Address *</Label>
          <Input
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div>
          <Label>Postcode *</Label>
          <Input
            value={formData.postcode}
            onChange={(e) => handleChange("postcode", e.target.value)}
          />
        </div>

        <div>
          <Label>Nationality *</Label>
          <Input
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
        </div>

        <div>
          <Label>Immigration Status *</Label>
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

        <div>
          <Label>Immigration Expiry Date *</Label>
          <Input
            type="date"
            value={formData.immigrationExpiry}
            onChange={(e) =>
              handleChange("immigrationExpiry", e.target.value)
            }
          />
        </div>

        <div>
          <Label>Do you need a UK Work Permit?</Label>
          <RadioGroup
            value={formData.workPermit}
            onValueChange={(value) =>
              handleChange("workPermit", value as "yes" | "no")
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
          <Label>Have you changed your name before?</Label>
          <RadioGroup
            value={formData.nameChanged}
            onValueChange={(value) =>
              handleChange("nameChanged", value as "yes" | "no")
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
          className={`transition-all duration-500 ease-in-out ${
            formData.nameChanged === "yes"
              ? "h-auto! opacity-100"
              : "h-0! overflow-hidden! opacity-0"
          }`}
        >
          <Label>Previous Name *</Label>
          <Input
            value={formData.previousName}
            onChange={(e) =>
              handleChange("previousName", e.target.value)
            }
          />
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            formData.nameChanged === "yes"
              ? "h-auto! opacity-100"
              : "h-0! overflow-hidden! opacity-0"
          }`}
        >
          <Label>Changed To *</Label>
          <Input
            value={formData.changedTo}
            onChange={(e) =>
              handleChange("changedTo", e.target.value)
            }
          />
        </div>
      </div>

      <SignupNavButtons
        disableBack
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