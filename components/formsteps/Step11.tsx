"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Step11Type } from "@/types/Form";


type NavProps = {
  onBack: () => void;
  disableBack?: boolean;
};

type Props = {
  back: () => void;
};

// ------------------ Navigation ------------------
function SignupNavButtons({ onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 justify-between">
      <Button type="button" variant="outline" onClick={onBack} disabled={disableBack}>
        <IoIosArrowBack />
        Back
      </Button>
    </div>
  );
}

// ------------------ Step6 Component ------------------
export default function Step1({ back }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<Step11Type>({
    declarationConfirmed: false,
    declarationDate: "",
    signatureFile: null,
  });

  const handleChange = <K extends keyof Step11Type>(key: K, value: Step11Type[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    if (!formData.declarationConfirmed) {
      toast.error("You must confirm the declaration");
      return false;
    }
    if (!formData.signatureFile) {
      toast.error("Please upload the signed document");
      return false;
    }
    if (!formData.declarationDate) {
      toast.error("Please select a date");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    console.log("FINAL SUBMISSION:", formData);
    toast.success("Application submitted successfully!");
  };

  return (
    <form className="min-w-full space-y-3 p-1 flex flex-col" onSubmit={handleSubmit}>
      {/* Declaration */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.declarationConfirmed}
          onChange={(e) => handleChange("declarationConfirmed", e.target.checked)}
          id="declaration"
          className="h-4 w-4"
        />
        <Label htmlFor="declaration">
          I confirm the information provided is true and complete
        </Label>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-600">
        Please download the signature document, sign it, and upload the signed
        file below before submitting the form.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Download Document */}
        <div className="mt-3">
          <Label>Download Signature Document </Label>
          <Button
            type="button"
            variant="outline"
            className="underline w-full"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/signature.docx"; // file in public folder
              link.download = "signature.docx";
              link.click();
            }}
          >
            Download Document
          </Button>
        </div>

        {/* Upload Signed File */}
        <div className="mt-3">
          <Label>Upload Signed Document *</Label>
          <Input
            type="file"
            accept=".doc,.docx,.pdf"
            onChange={(e) => handleChange("signatureFile", e.target.files?.[0] || null)}
            className="py-1"
          />
        </div>
      </div>

      {/* Date */}
      <Label className="mt-3">Date *</Label>
      <Input
        type="date"
        value={formData.declarationDate}
        onChange={(e) => handleChange("declarationDate", e.target.value)}
        className="py-3"
      />

      {/* Buttons */}
      <div className="flex items-center justify-between gap-2 mt-5">
        <SignupNavButtons onBack={back} />
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}