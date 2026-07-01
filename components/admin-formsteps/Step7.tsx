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
export default function Step7({ next, back, userId }: any) {
  const [loading, setLoading] = useState(false);
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
    const fetchData = async () => {
      if (!userId) {
        toast.error("Id not found in useEffect");
        return;
      }
      setLoading(true);

      const res = await getTrainings(userId);

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
    if (!userId) {
      toast.error("Id not found in handle Submit");
      return;
    }
    setLoading(true);
    const res = await saveTrainings(userId, trainings);

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
      <div>
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
    </div>
  );
}
