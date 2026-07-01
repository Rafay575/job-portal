"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

import { Step7Type } from "@/types/Form";
import { getTrainings, saveTrainings } from "@/lib/api/step7";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { FullPageLoader } from "../Loading";
import { useRouter } from "next/navigation";
import { checkApproval } from "@/lib/users";
import { IoRefresh } from "react-icons/io5";
import Link from "next/link";
import { DocCard } from "../common/DocCard";

// ================= NAV BUTTONS =================
function SignupNavButtons({ onNext, onBack }: any) {
  return (
    <div className="flex justify-between mt-4">
      <Button type="button" variant="outline" onClick={onBack}>
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

// ================= MAIN COMPONENT =================
export default function Step7({ next, back }: any) {
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const [trainings, setTrainings] = useState<Step7Type[]>([
    {
      title: "",
      provider: "",
      duration: "",
      completionDate: "",
      certificateFile: null,
    },
  ]);
  // ================= FETCH EXISTING DATA =================
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
      if (!user.id) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);

      const res = await getTrainings(user.id);

      if (res.success && res.data?.length > 0) {
        setTrainings(
          res.data.map((t: any) => ({
            title: t.title,
            provider: t.provider,
            duration: t.duration,
            completionDate: t.completion_date,
            certificateFile: t.certificate_file_path || null, // ← merged
          })),
        );
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // ================= UPDATE FIELD =================
  const updateTraining = (
    index: number,
    field: keyof Step7Type,
    value: string,
  ) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  // ================= ADD =================
  const addTraining = () => {
    setTrainings([
      ...trainings,
      {
        title: "",
        provider: "",
        duration: "",
        completionDate: "",
        certificateFile: null,
      },
    ]);
  };
  // ================= REMOVE =================
  const removeTraining = (index: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          Are you sure you want to remove this training?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setTrainings((prev) => prev.filter((_, i) => i !== index));

              toast.dismiss(t.id);
              toast.success("Training removed");
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    ));
  };
  // ================= VALIDATION =================
  const validateStep = () => {
    for (let i = 0; i < trainings.length; i++) {
      const t = trainings[i];

      if (
        !t.title ||
        !t.provider ||
        !t.duration ||
        !t.certificateFile || // ← simplified
        !t.completionDate
      ) {
        toast.error(`Complete all fields for training ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // ================= SUBMIT (CREATE + UPDATE SAME API) =================
  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!user.id) {
      toast.error("Id not found in handle Submit");
      return;
    }
    setLoading(true);
    const res = await saveTrainings(user.id, trainings);

    if (res.success) {
      toast.success(res.message);
      next();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const updateTrainingFile =
    (index: number) =>
    <K extends keyof Step7Type>(field: K, value: Step7Type[K]) => {
      setTrainings((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    };
  if (loading) return <FullPageLoader />;

  // ================= UI =================
  return (
    <div className="relative px-2">
      <div
        className={blur ? "blur-[3px] pointer-events-none select-none p-2" : ""}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {trainings.map((t, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border rounded-xl p-4 space-y-4 bg-white shadow-sm"
                >
                  {/* Title */}
                  <Label className="font-semibold text-lg">
                    Training {index + 1}
                  </Label>

                  {/* Course Title */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1 mb-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={t.title}
                      onChange={(e) =>
                        updateTraining(index, "title", e.target.value)
                      }
                    />
                  </div>

                  {/* Provider */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1 mb-1">
                      Provider <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={t.provider}
                      onChange={(e) =>
                        updateTraining(index, "provider", e.target.value)
                      }
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={t.duration}
                      onChange={(e) =>
                        updateTraining(index, "duration", e.target.value)
                      }
                    />
                  </div>

                  {/* Training Certificate */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1 mb-1">
                      Training Certificate
                      <span className="text-red-700">*</span>
                    </Label>

                    <DocCard<Step7Type>
                      title="Training Certificate"
                      fieldKey="certificateFile"
                      hint="Upload certificate (PDF, DOC, DOCX, JPG, JPEG or PNG)"
                      file={t.certificateFile}
                      onUpdate={updateTrainingFile(index)}
                      acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png", ".jpeg"]}
                    />
                  </div>

                  {/* Completion Date */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1 mb-1">
                      Completion Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={t.completionDate}
                      onChange={(e) =>
                        updateTraining(index, "completionDate", e.target.value)
                      }
                    />
                  </div>

                  {/* Remove Button */}
                  {trainings.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeTraining(index)}
                    >
                      Remove
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button type="button" onClick={addTraining}>
            Add Another Training
          </Button>

          <SignupNavButtons onBack={back} onNext={handleSubmit} />
        </div>
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
