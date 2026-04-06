"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { checkApproval } from "@/lib/usersApproval";

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
    { title: "", provider: "", duration: "", completionDate: "" },
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
        toast.error(
          "You are not allowed until admin approves your application.",
        );
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
      { title: "", provider: "", duration: "", completionDate: "" },
    ]);
  };

  // ================= REMOVE =================
  const removeTraining = (index: number) => {
    setTrainings(trainings.filter((_, i) => i !== index));
  };

  // ================= VALIDATION =================
  const validateStep = () => {
    for (let i = 0; i < trainings.length; i++) {
      const t = trainings[i];

      if (!t.title || !t.provider || !t.duration || !t.completionDate) {
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
  if (loading) return <FullPageLoader />;

  // ================= UI =================
  return (
    <div className="relative">
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
                      Course Title <span className="text-red-500">*</span>
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
