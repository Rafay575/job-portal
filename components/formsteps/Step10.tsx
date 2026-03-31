"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step10Type } from "@/types/Form";
import { submitStep10, getStep10 } from "@/lib/api/step10";
import { useEffect } from "react";
import { user_id } from "@/lib/id";

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

export default function Step10({ next, back }: Props) {
  const [formData, setFormData] = useState<Step10Type>({
    supportingStatement: "",
  });

  const validateStep = (): boolean => {
    const wordCount = formData.supportingStatement.trim().split(/\s+/).length;

    if (!formData.supportingStatement || wordCount > 150) {
      toast.error("Please provide a supporting statement (max 150 words)");
      return false;
    }

    return true;
  };
  useEffect(() => {
    const fetchStep10 = async () => {
      const res = await getStep10(user_id);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          supportingStatement: d.supporting_statement || "",
        });
      }
    };

    fetchStep10();
  }, []);
  const handleSubmitStep10 = async () => {
    if (!validateStep()) return;

    try {
      const res = await submitStep10({
        userId: user_id,
        supportingStatement: formData.supportingStatement,
      });

      if (res.success) {
        toast.success(res.data?.message || "Step10 saved");
        next();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-w-full space-y-3 p-1 flex flex-col">
      <Label>Supporting Statement (Max 150 words)</Label>
      <Textarea
        value={formData.supportingStatement}
        onChange={(e) =>
          setFormData({ ...formData, supportingStatement: e.target.value })
        }
        placeholder="Why are you applying & how do you match the role?"
        className="py-3 min-h-[150px]"
      />
      <SignupNavButtons onBack={back} onNext={handleSubmitStep10} />
    </div>
  );
}
