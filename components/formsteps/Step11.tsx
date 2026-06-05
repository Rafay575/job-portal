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
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

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

export default function Step11({ back }: Props) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);

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
      // ✅ Convert canvas to File BEFORE building FormData
      let signatureFile: File | null = null;

      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        signatureFile = await signatureToFile();
        if (!signatureFile) return;
      }
      const formDataToSend = new FormData();

      formDataToSend.append("userId", String(user.id));
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

      if (user.name) {
        formDataToSend.append("name", user.name);
      }
      setLoading(true);
      const res = await submitStep11(formDataToSend);

      if (res.success) {
        toast.success(res.data?.message || "Submitted!");
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
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
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
                      {user?.name || ""}
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

      {/* Overlay */}
      {blur && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Appliaction Submitted Successfully.
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
