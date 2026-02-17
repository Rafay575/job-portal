"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function Step11() {
  const router = useRouter();
  const step = 11;

  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");

  const handleBack = () => {
    router.push(`/auth/signup/step${step - 1}`);
  };

  const validateStep = (): boolean => {
    if (!declarationConfirmed) {
      toast.error("You must confirm the declaration");
      return false;
    }
    if (!digitalSignature) {
      toast.error("Please provide your digital signature");
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
      digitalSignature,
      declarationDate,
    };

    console.log("FINAL SUBMISSION:", payload);

    toast.success("Application submitted successfully!");

    // redirect after submit
    router.push("/");
  };

  return (
    <>
      

      <form
        className="min-w-full space-y-3 p-1 flex flex-col"
        onSubmit={handleSubmit}
      >
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

        <Label className="mt-3">Digital Signature *</Label>
        <Input
          placeholder="Type your full name as signature"
          value={digitalSignature}
          onChange={(e) => setDigitalSignature(e.target.value)}
          className="py-3"
        />

        <Label className="mt-3">Date *</Label>
        <Input
          type="date"
          value={declarationDate}
          onChange={(e) => setDeclarationDate(e.target.value)}
          className="py-3"
        />

        <div className="flex gap-2 mt-5">
          <Button variant="outline" type="button" onClick={handleBack}>
            <IoIosArrowBack />Back
          </Button>

          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
