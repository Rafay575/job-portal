"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Step11Type } from "@/types/Form";
import { submitStep11, getStep11 } from "@/lib/api/step11";
import { useEffect } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { FullPageLoader } from "../Loading";
import { checkApproval } from "@/lib/usersApproval";

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

// ------------------ Step6 Component ------------------
export default function Step11({ back }: Props) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const submittedAt = new Date().toLocaleString();
  const [existingFile, setExistingFile] = useState<string | null>(null);

  const [formData, setFormData] = useState<Step11Type>({
    declarationConfirmed: undefined,
    declarationDate: "",
    signatureFile: null,
  });

  const handleChange = <K extends keyof Step11Type>(
    key: K,
    value: Step11Type[K],
  ) => {
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

    // ✅ allow existing file OR new file
    if (!formData.signatureFile && !existingFile) {
      toast.error("Please upload the signed document");
      return false;
    }

    if (!formData.declarationDate) {
      toast.error("Please select a date");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!user.id) {
        toast.error("Id not found ");
        router.push("/");
        return;
      }
      const isApproved = await checkApproval(user.id);

      if (!isApproved) {
        setBlur(true);
      }
    };

    verifyUser();
    const fetchData = async () => {
      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);
      const res = await getStep11(user.id);

      if (res.success && res.data?.[0]) {
        const d = res.data[0];

        setFormData({
          declarationConfirmed: Boolean(d.declaration_confirmed),
          declarationDate: d.declaration_date || "",
          signatureFile: null,
        });

        setExistingFile(d.signature_file || null); // ✅ store file path
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("userId", String(user.id));
      formDataToSend.append(
        "declarationConfirmed",
        String(formData.declarationConfirmed),
      );
      formDataToSend.append("declarationDate", formData.declarationDate);

      if (formData.signatureFile) {
        formDataToSend.append("signatureFile", formData.signatureFile);
      }
      if (user.email) {
        formDataToSend.append("email", user.email);
      }

      if (user.name) {
        formDataToSend.append("name", user.name);
      }
      setLoading(true);
      const res = await submitStep11(formDataToSend);

      if (res.success) {
        toast.success(res.data?.message || "Submitted!");
        console.log("FINAL SUBMISSION:", formData);
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <FullPageLoader />;

  return (
    <div className="relative px-2">
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
      >
        <form className="w-full space-y-2" onSubmit={handleSubmit}>
          {/* Declaration */}
          <div className="flex items-start gap-3 p-1 rounded-xl ">
            <input
              type="checkbox"
              checked={formData.declarationConfirmed}
              onChange={(e) =>
                handleChange("declarationConfirmed", e.target.checked)
              }
              id="declaration"
              className="h-4 w-4 mt-1"
            />
            <Label htmlFor="declaration" className="text-sm leading-relaxed">
              I confirm the information provided is true and complete
            </Label>
          </div>

          {/* Info Box */}
          <div className="border rounded p-3 bg-primary text-sm text-white">
            Please download the signature document, sign it, and upload the
            signed file below before submitting the form.
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Download */}
            <div className="flex flex-col gap-2 p-4 border rounded-xl">
              <Label className="font-medium">Download Signature Document</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/signature.docx";
                  link.download = "signature.docx";
                  link.click();
                }}
              >
                Download Document
              </Button>
            </div>

            {/* Upload */}
            <div className="flex flex-col gap-2 p-4 border rounded-xl">
              <Label className="font-medium">
                Upload Signed Document <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(e) =>
                  handleChange("signatureFile", e.target.files?.[0] || null)
                }
              />

              {existingFile && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(existingFile, "_blank")}
                >
                  View Uploaded Document
                </Button>
              )}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2 p-4 border rounded-xl col-span-2 md:col-span-1">
              <Label className="font-medium">
                Declaration Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.declarationDate}
                onChange={(e) =>
                  handleChange("declarationDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4">
            <SignupNavButtons onBack={back} />
            <Button type="submit" className="px-6">
              Submit
            </Button>
          </div>
        </form>
      </div>

      {/* Overlay */}
      {blur && (
        <div className="absolute inset-0 flex items-center justify-center  z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Appliaction Approval Pending
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your appliaction is under review. You’ll gain full access once
              approved and will let you know by email.
            </p>

            {/* Optional action */}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1 bg-primary text-white rounded-full"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
