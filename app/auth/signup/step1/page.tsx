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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
  step: number;
  validateStep: () => boolean; // pass validation function
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
    <div className="flex gap-2 mt-3 ">
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={step === 1}
      >
        Back
      </Button>

      <Button type="button" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
}

export default function Step1() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [nationality, setNationality] = useState("");
  const [immigrationStatus, setImmigrationStatus] = useState("");
  const [immigrationExpiry, setImmigrationExpiry] = useState("");
  const [workPermit, setWorkPermit] = useState("no");
  const [nameChanged, setNameChanged] = useState("no");
  const [previousName, setPreviousName] = useState("");
  const [changedTo, setChangedTo] = useState("");

  // Validation function
  const validateStep = (): boolean => {
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
      <h2 className="text-primary text-3xl font-medium  mb-4 md:mb-7 text-center">
        Basic Personal Information
      </h2>
      <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1  grid-cols-1 md:grid-cols-2 ">
        <div>
          <Label>Full Name *</Label>
          <Input
            value={fullName}
            placeholder="John Smith"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <Label>Email Address *</Label>
          <Input
            value={email}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Phone Number *</Label>
          <Input
            value={phone}
            placeholder="923254412292"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label>Current Address *</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <Label>Postcode *</Label>
          <Input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <div>
          <Label>Nationality *</Label>
          <Input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
        </div>

        <div>
          <Label>Immigration Status *</Label>
          <Select
            value={immigrationStatus}
            onValueChange={setImmigrationStatus}
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
            value={immigrationExpiry}
            onChange={(e) => setImmigrationExpiry(e.target.value)}
          />
        </div>

        <div>
          <Label>Do you need a UK Work Permit?</Label>
          <RadioGroup value={workPermit} onValueChange={setWorkPermit}>
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
          <RadioGroup value={nameChanged} onValueChange={setNameChanged}>
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

        {nameChanged === "yes" && (
          <>
            <div>
              <Label>Previous Name *</Label>
              <Input
                value={previousName}
                onChange={(e) => setPreviousName(e.target.value)}
              />
            </div>
            <div>
              <Label>Changed To *</Label>
              <Input
                value={changedTo}
                onChange={(e) => setChangedTo(e.target.value)}
              />
            </div>
          </>
        )}

        <SignupNavButtons step={step} validateStep={validateStep} />
      </div>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/login"
          className="text-[var(--primary)] font-[400]"
        >
          Login
        </Link>
      </p>
    </>
  );
}
