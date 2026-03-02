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
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

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
  roleType: string;
};
export default function Step1FullTime({ next, back, roleType }: Props) {
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
  const [cvFile, setCvFile] = useState<File | null>(null);
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

    // ✅ CV validation only for full-time or both
    if (roleType === "full-time" || roleType === "both") {
      if (!cvFile) {
        toast.error("Please upload your CV");
        return false;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(cvFile.type)) {
        toast.error("CV must be PDF, DOC, or DOCX");
        return false;
      }

      if (cvFile.size > 5 * 1024 * 1024) {
        toast.error("CV must be less than 5MB");
        return false;
      }
    }

    return true;
  };

  return (
    <>
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

        <div
          className={`transition-all duration-500 ease-in-out  ${nameChanged === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}
        >
          <Label>Previous Name *</Label>
          <Input
            value={previousName}
            onChange={(e) => setPreviousName(e.target.value)}
          />
        </div>
        <div
          className={`transition-all duration-500 ease-in-out  ${nameChanged === "yes" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"}`}
        >
          <Label>Changed To *</Label>
          <Input
            value={changedTo}
            onChange={(e) => setChangedTo(e.target.value)}
          />
        </div>

        <div
          className={`${roleType === "full-time" || roleType === "both" ? "h-auto!  opacity-100 " : "h-0! overflow-hidden!  opacity-0"} transition-all duration-500 ease-in-out  md:col-span-2`}
        >
          <Label>Upload CV *</Label>

          <div className="mt-2 relative border! border-dashed shadow-0 outline-0 border-primary rounded-xl p-6 text-center  transition">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCvFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <p className="text-sm text-muted-foreground">
              {cvFile
                ? `Selected: ${cvFile.name}`
                : "Click or drag your CV here (PDF, DOC, DOCX – Max 5MB)"}
            </p>
          </div>
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
