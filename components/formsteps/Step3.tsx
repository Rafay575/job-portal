"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Step3Type } from "@/types/Form";
import { useEffect } from "react";
import { getStep3 } from "@/lib/api/step3";
import { submitStep3 } from "@/lib/api/step3";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";
import { DocCard } from "../common/DocCard";

type NavProps = {
  onNext: () => void;
  onBack: () => void;
  disableBack?: boolean;
};

type Props = {
  next: () => void;
  back: () => void;
};

// ------------------ Navigation Buttons ------------------
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

// ------------------ Step 3 Component ------------------
export default function Step3({ next, back }: Props) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<Step3Type>({
    hasConvictions: null,
    convictionDetails: "",
    hasUnspentConvictions: null,
    unspentDetails: "",
    fitnessInvestigation: null,
    removedFromRegister: null,
    crb: null,
    certificateNumber: "", // ← NEW FIELD
    fullName: "", // ← NEW FIELD
    surname: "",
    dob: "",
    crbFile: null,
  });

  const handleChange = <K extends keyof Step3Type>(
    key: K,
    value: Step3Type[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep = (): boolean => {
    if (formData.hasConvictions && !formData.convictionDetails) {
      toast.error("Please provide conviction details");
      return false;
    }

    if (formData.hasUnspentConvictions && !formData.unspentDetails) {
      toast.error("Please provide unspent conviction details");
      return false;
    }

    if (formData.crb) {
      if (!formData.certificateNumber) {
        toast.error("Cetificate number is required");
        return false;
      }
      if (!formData.fullName) {
        toast.error("Full name is required");
        return false;
      }
      if (!formData.surname) {
        toast.error("Surname is required");
        return false;
      }

      if (!formData.dob) {
        toast.error("Date of birth is required");
        return false;
      }

      if (!formData.crbFile) {
        toast.error("Please upload CRB/DBS document");
        return false;
      }
    }

    return true;
  };

  const router = useRouter();
  useEffect(() => {
    const verifyUser = async () => {
      if (!user.id) {
        toast.error("Id not found  ");
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
      setLoading(true);

      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }
      const res = await getStep3(user.id);

      if (res.success && res.data[0]) {
        const d = res.data[0];

        setFormData({
          hasConvictions: Boolean(d.has_convictions),
          convictionDetails: d.conviction_details || "",
          hasUnspentConvictions: Boolean(d.has_unspent_convictions),
          unspentDetails: d.unspent_details || "",
          fitnessInvestigation: Boolean(d.fitness_investigation),
          removedFromRegister: Boolean(d.removed_from_register),
          crb: Boolean(d.crb),
          certificateNumber: d.certificate_number || "", // ← NEW FIELD
          fullName: d.full_name || "",
          surname: d.surname || "",
          dob: d.dob ? d.dob.split("T")[0] : "",
         crbFile: d.crb_file_path || null,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmitStep3 = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      const form = new FormData();

      form.append("userId", String(user.id));
      form.append("hasConvictions", String(formData.hasConvictions));
      form.append("convictionDetails", formData.convictionDetails);

      form.append(
        "hasUnspentConvictions",
        String(formData.hasUnspentConvictions),
      );
      form.append("unspentDetails", formData.unspentDetails);

      form.append(
        "fitnessInvestigation",
        String(formData.fitnessInvestigation),
      );

      form.append("removedFromRegister", String(formData.removedFromRegister));

      form.append("crb", String(formData.crb));
      form.append("certificateNumber", formData.certificateNumber); // ← NEW FIELD
      form.append("fullName", formData.fullName);
      form.append("surname", formData.surname);
      form.append("dob", formData.dob);

      if (formData.crbFile instanceof File) {
        form.append("crbFile", formData.crbFile);
      }

      const res = await submitStep3(form);

      if (res.success) {
        toast.success(res.data?.message || "Step 3 saved!");
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
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
      >
        <div className="min-w-full space-y-5 p-1 grid gap-x-5 gap-y-1 grid-cols-1 md:grid-cols-2">
          {/* Convictions */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>
               <span>Any convictions?<span className="text-red-500">*</span></span>
              </Label>
              <RadioGroup
                value={formData.hasConvictions ? "yes" : "no"}
                onValueChange={(v) =>
                  handleChange("hasConvictions", v === "yes")
                }
              >
                <div className="flex gap-4 mt-2">
                  <RadioGroupItem value="yes" id="convictYes" />
                  <Label htmlFor="convictYes">Yes</Label>
                  <RadioGroupItem value="no" id="convictNo" />
                  <Label htmlFor="convictNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                formData.hasConvictions
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>
                 <span>Conviction Details <span className="text-red-500">*</span></span>
              </Label>
              <Textarea
                value={formData.convictionDetails}
                onChange={(e) =>
                  handleChange("convictionDetails", e.target.value)
                }
              />
            </div>
          </div>

          {/* Unspent Convictions */}
          <div className="flex flex-col items-stretch gap-4">
            <div>
              <Label>
                 <span>Do you have any unspent convictions?
                <span className="text-red-500">*</span></span>
              </Label>
              <RadioGroup
                value={formData.hasUnspentConvictions ? "yes" : "no"}
                onValueChange={(v) =>
                  handleChange("hasUnspentConvictions", v === "yes")
                }
              >
                <div className="flex gap-4 mt-2">
                  <RadioGroupItem value="yes" id="unspentYes" />
                  <Label htmlFor="unspentYes">Yes</Label>
                  <RadioGroupItem value="no" id="unspentNo" />
                  <Label htmlFor="unspentNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                formData.hasUnspentConvictions
                  ? "h-auto! opacity-100"
                  : "h-0! overflow-hidden! opacity-0"
              }`}
            >
              <Label>
                <span>Unspent Conviction Details<span className="text-red-500">*</span></span>
              </Label>
              <Textarea
                value={formData.unspentDetails}
                onChange={(e) => handleChange("unspentDetails", e.target.value)}
              />
            </div>
          </div>

          {/* Fitness Investigation */}
          <div>
            <Label>
              <span>Currently under fitness to practice investigation?
              <span className="text-red-500">*</span></span>
            </Label>
            <RadioGroup
              value={formData.fitnessInvestigation ? "yes" : "no"}
              onValueChange={(v) =>
                handleChange("fitnessInvestigation", v === "yes")
              }
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="fitnessYes" />
                <Label htmlFor="fitnessYes">Yes</Label>
                <RadioGroupItem value="no" id="fitnessNo" />
                <Label htmlFor="fitnessNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Removed From Register */}
          <div>
            <Label>
               <span>Have you been ever removed from professional registeration? 
              <span className="text-red-500">*</span></span>
            </Label>
            <RadioGroup
              value={formData.removedFromRegister ? "yes" : "no"}
              onValueChange={(v) =>
                handleChange("removedFromRegister", v === "yes")
              }
            >
              <div className="flex gap-4 mt-2">
                <RadioGroupItem value="yes" id="removedYes" />
                <Label htmlFor="removedYes">Yes</Label>
                <RadioGroupItem value="no" id="removedNo" />
                <Label htmlFor="removedNo">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* CRB */}
          <div className="flex flex-col items-stretch gap-4 md:col-span-2">
            <div>
              <Label>
                <span>Do you have DBS/CRB on update service? 
                <span className="text-red-500">*</span></span>
              </Label>
              <RadioGroup
                value={formData.crb ? "yes" : "no"}
                onValueChange={(v) => handleChange("crb", v === "yes")}
              >
                <div className="flex gap-4 mt-2 items-center">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="crbYes" />
                    <Label htmlFor="crbYes">Yes</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="crbNo" />
                    <Label htmlFor="crbNo">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Fields */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                formData.crb
                  ? "opacity-100 max-h-[900px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                {/* Certificate Number - NEW FIELD */}
                <div>
                  <Label><span>Certificate Number <span className="text-red-500">*</span></span></Label>
                  <Input
                    value={formData.certificateNumber}
                    onChange={(e) =>
                      handleChange("certificateNumber", e.target.value)
                    }
                  />
                </div>

                {/* Full Name - NEW FIELD */}
                <div>
                  <Label><span>Full Name <span className="text-red-500">*</span></span></Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    <span>Surname <span className="text-red-500">*</span></span>
                  </Label>
                  <Input
                    value={formData.surname}
                    onChange={(e) => handleChange("surname", e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                     <span>Date of Birth <span className="text-red-500">*</span></span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    <span>Upload DBS/CRB <span className="text-red-500">*</span></span>
                  </Label>
                   <DocCard<Step3Type>
                    title="DBS / CRB"
                    fieldKey="crbFile"
                    hint="Upload your DBS/CRB (PDF, DOC, DOCX, JPG, JPEG or PNG)"
                    file={formData.crbFile}
                    onUpdate={handleChange}
                    acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png", ".jpeg"]}
                  />
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <SignupNavButtons onBack={back} onNext={handleSubmitStep3} />
      </div>

      {/* Overlay */}
      {blur && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Application Submitted Successfully.
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              One of our representative will get back to you with in 24 to 48
              hours.
            </p>

            {/* Optional action */}
            <div className="flex justify-evenly items-center">
              <Link href={"/"}>
                <button className="px-6 py-1 bg-primary text-white rounded text-[15px] flex gap-1 items-center">
                  Done
                  {/* <IoMdCheckmark className="size-5 mb-0.5"/> */}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
