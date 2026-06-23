"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step10Type } from "@/types/Form";
import { submitStep10, getStep10 } from "@/lib/api/step10";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";

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
  userId: any;
};

export default function Step10({ next, back, userId }: Props) {
  const [loading, setLoading] = useState(false);

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
  const router = useRouter();
  useEffect(() => {
    const fetchStep10 = async () => {
      setLoading(true);

      if (!userId) {
        toast.error("Id not found in useEffect");
        return;
      }
      const res = await getStep10(userId);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          supportingStatement: d.supporting_statement || "",
        });
      }
      setLoading(false);
    };

    fetchStep10();
  }, []);
  const handleSubmitStep10 = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const res = await submitStep10({
        userId: userId,
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
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <FullPageLoader />;

  return (
    <div className="relative px-2">
      <div>
        <div className="min-w-full space-y-3 p-1 flex flex-col">
          <Label>
            Supporting Statement (Max 150 words)
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={formData.supportingStatement}
            onChange={(e) =>
              setFormData({ ...formData, supportingStatement: e.target.value })
            }
            className="py-3 min-h-[150px] mt-2"
          />
          <SignupNavButtons onBack={back} onNext={handleSubmitStep10} />
        </div>
      </div>
    </div>
  );
}
