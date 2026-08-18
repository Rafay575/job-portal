"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Step11Type } from "@/types/Form";
import { submitStep11, getStep11, submitStep11Admin } from "@/lib/api/step11";
import { useEffect } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { FullPageLoader } from "../Loading";
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import { getDetails } from "@/lib/api/step1";

type NavProps = {
  onBack: () => void;
  disableBack?: boolean;
};

type Props = {
  back: () => void;
  userId:any
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

export default function Step11({ back ,userId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [user,setUser]=useState({
    fullName:"",
    email:""
  })

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
    if (!existingFile && (!sigCanvas.current || sigCanvas.current.isEmpty())) {
      toast.error("Please provide your signature");
      return false;
    }

    if (!formData.declarationDate) {
      toast.error("Please select a date");
      return false;
    }

    return true;
  };

  useEffect(() => {
    
    const fetchData = async () => {
      if (!userId) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);
      const res = await getStep11(userId);

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
    const fetchDetails = async () => {
      const res2 = await getDetails(userId);
      console.log("res2", res2);
      if (res2.success && res2.data) {
        const d = res2.data;
        setUser((prev) => ({
          ...prev,
          fullName: d.name || "",
          email: d.email || "",
        }));
      }
    };
    fetchDetails();

  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      // ✅ Convert canvas to File BEFORE building FormData
      let signatureFile: File | null = null;

      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        signatureFile = await signatureToFile();
        if (!signatureFile) return;
      }
      const formDataToSend = new FormData();

      formDataToSend.append("userId", String(userId));
      formDataToSend.append(
        "declarationConfirmed",
        String(formData.declarationConfirmed),
      );
      formDataToSend.append("declarationDate", formData.declarationDate);

      if (signatureFile) {
        formDataToSend.append("signatureFile", signatureFile);
      } 
      // else if (existingFile) {
      //   formDataToSend.append("signatureFile", existingFile);
      // }

      if (user.email) {
        formDataToSend.append("email", user.email);
      }

      if (user.fullName) {
        formDataToSend.append("name", user.fullName);
      }
      setLoading(true);
      const res = await submitStep11Admin(formDataToSend);

      if (res.success) {
        toast.success(res.data?.message || "Submitted!");
  
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

  const signatureToFile = async (): Promise<File | null> => {
    if (!sigCanvas.current) return null;

    if (sigCanvas.current.isEmpty()) {
      toast.error("Please provide a signature");
      return null;
    }

    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    const blob = await fetch(dataURL).then((r) => r.blob());

    return new File([blob], `signature-${Date.now()}.png`, {
      type: "image/png",
    });
  };
  if (loading) return <FullPageLoader />;

  return (
    <div className="relative px-2">
      <div
      >
        <form className="w-full space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Candidate Information */}
            <h3 className="font-semibold text-lg mb-4">
              Candidate Declaration
            </h3>
            <div className="space-y-6 border p-4 rounded-xl max-h-[400px]  lg:max-h-[300px] overflow-y-auto">
              <div>
                <div className="py-2 mt-1">
                  <Label className="font-[600] text-[16px]! ">
                    Full Name:{" "}
                    <span className="font-[400] underline">
                      {user?.fullName || ""}
                    </span>
                  </Label>
                </div>
                <div className="pb-1">
                  <Label className="font-[600] text-[16px]! ">
                    Email Address:{" "}
                    <span className="font-[400] underline">
                      {user?.email || ""}
                    </span>
                  </Label>
                </div>
              </div>
              {/* Authorization */}
              <div className="space-y-3 text-sm leading-6">
                <h3 className="font-semibold text-lg mb-4">
                  Authorization and Consent
                </h3>
                <p>
                  I, the undersigned, hereby authorize <b>Hayaibu Talent </b> to
                  contact my current and/or previous employers, as well as other
                  references I have provided, to verify information regarding my
                  employment history, performance, and qualifications. This may
                  include, but is not limited to, inquiries about my job duties,
                  professional conduct, dates of employment, and eligibility for
                  rehire.
                </p>

                <p>
                  I understand that this information will be used solely to
                  assess my suitability for employment with Kingsbury
                  Personnel's clients. I release <b>Hayaibu Talent</b> and all
                  persons or entities providing such information from any
                  liability arising from the release or use of this information.
                </p>
              </div>

              {/* Acknowledgement */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Acknowledgement</h3>
                <p>I acknowledge that:</p>
                <ul className="list-disc ml-6 space-y-2 text-sm">
                  <li>I have read and understood this consent form.</li>
                  <li>
                    I voluntarily agree to the reference checks as described
                    above.
                  </li>
                  <li>
                    A copy of this authorization shall be as valid as the
                    original.
                  </li>
                </ul>
              </div>
            </div>

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

            {/* Signature & Date */}
            <div
              className={`${formData.declarationConfirmed ? "h-auto" : "h-0 overflow-hidden"} transition-all duration-300 grid md:grid-cols-2 gap-3`}
            >
              <div className="w-full ">
                <Label className="font-[600] text-[17px]!">
                  Candidate Signature:<span className="text-red-700">*</span>
                </Label>

                {/* Upload */}
                <div className="flex flex-col gap-2 rounded-xl">
                  {/* ✅ Show existing signature as image preview when no new drawing yet */}
                  {existingFile && (
                    <div className="border rounded-md w-full h-[200px] flex flex-col items-center justify-center bg-gray-50 gap-2">
                      <p className="text-xs text-gray-400">Saved Signature</p>
                      <img
                        src={existingFile}
                        alt="Existing Signature"
                        className="max-h-[150px] object-contain"
                      />
                      <button
                        type="button"
                        className="text-xs text-primary underline"
                        onClick={() => setExistingFile(null)} // clears preview so canvas shows
                      >
                        Draw a new signature instead
                      </button>
                    </div>
                  )}

                  {/* ✅ Show canvas only when no existing file or user chose to redraw */}
                  {!existingFile && (
                    <div>
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="#5C49D8"
                        canvasProps={{
                          className: "border rounded-md w-full h-[200px]",
                        }}
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => sigCanvas.current?.clear()}
                        >
                          Clear Signature
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="w-full ">
                <Label className="font-[600] text-[17px]!">
                  Declaration Date:<span className="text-red-700">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.declarationDate}
                  onChange={(e) =>
                    handleChange("declarationDate", e.target.value)
                  }
                  className="w-full"
                />
              </div>
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

      
    </div>
  );
}