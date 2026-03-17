"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

type NavProps = {
  onBack: () => void;
  disableBack?: boolean;
};

function SignupNavButtons({ onBack, disableBack }: NavProps) {
  return (
    <div className="flex gap-2 justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={disableBack}
      >
        <IoIosArrowBack />
        Back
      </Button>
    </div>
  );
}

type Props = {
  back: () => void;
};

export default function Step1({ back }: Props) {
  const router = useRouter();

  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [declarationDate, setDeclarationDate] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const validateStep = (): boolean => {
    if (!declarationConfirmed) {
      toast.error("You must confirm the declaration");
      return false;
    }
    if (!signatureFile) {
      toast.error("Please upload the signed document");
      return false;
    }
    if (!declarationDate) {
      toast.error("Please select a date");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) return;

    const payload = {
      declarationConfirmed,
      declarationDate,
      signatureFile,
    };

    console.log("FINAL SUBMISSION:", payload);

    toast.success("Application submitted successfully!");
    router.push("/");
  };

  return (
    <form
      className="min-w-full space-y-3 p-1 flex flex-col"
      onSubmit={handleSubmit}
    >
      {/* Declaration */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={declarationConfirmed}
          onChange={(e) => setDeclarationConfirmed(e.target.checked)}
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
            onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
            className="py-1"
          />
        </div>
      </div>
      {/* Date */}
      <Label className="mt-3">Date *</Label>
      <Input
        type="date"
        value={declarationDate}
        onChange={(e) => setDeclarationDate(e.target.value)}
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
