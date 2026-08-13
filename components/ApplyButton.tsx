"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RootState } from "@/lib/store";
import { applyToJob, checkJobApplication } from "@/lib/appliedJobs";

type ApplyButtonProps = {
  saleId: number;
};

export default function ApplyButton({ saleId }: ApplyButtonProps) {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);

  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // CHECK WHETHER USER ALREADY APPLIED
  // ============================================

  useEffect(() => {
    const checkApplication = async () => {
      if (!user?.loggedIn || !user?.id) {
        setApplied(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        const response = await checkJobApplication(saleId, Number(user.id));

        if (response.success) {
          setApplied(response.applied);
        }
      } catch (error) {
        console.error("Failed to check application:", error);
      } finally {
        setChecking(false);
      }
    };

    checkApplication();
  }, [saleId, user?.id, user?.loggedIn]);

  // ============================================
  // ACTUAL APPLY API CALL
  // ============================================

  const confirmApply = async () => {
    if (!user?.loggedIn) {
      toast.error("Please log in to apply for this job.");

      router.push("/auth/login");

      return;
    }

    if (!user?.id) {
      toast.error("Unable to identify your account.");

      return;
    }

    if (applied || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await applyToJob(saleId, Number(user.id));

      if (response.success) {
        setApplied(true);

        toast.success("Application submitted successfully!");

        return;
      }

      if (response.alreadyApplied) {
        setApplied(true);

        toast.error("You have already applied for this job.");

        return;
      }

      toast.error(response.message || "Failed to submit application.");
    } catch (error) {
      console.error("Application error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // SHOW CONFIRMATION TOAST
  // ============================================

  const handleApply = () => {
    if (!user?.loggedIn) {
      toast.error("Please log in to apply for this job.");

      router.push("/auth/login");

      return;
    }

    if (!user?.id) {
      toast.error("Unable to identify your account.");

      return;
    }

    if (applied || submitting) {
      return;
    }

    toast.custom(
      (t) => (
        <div
          className={`
            w-[calc(100vw-32px)]
            max-w-[380px]
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-800
            p-5
            shadow-2xl
            ${t.visible ? "animate-enter" : "animate-leave"}
          `}
        >
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Confirm Application
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Are you sure you want to apply for this job? Your application will
              be submitted to the recruitment team.
            </p>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmApply();
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Yes, Apply
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      },
    );
  };

  // ============================================
  // CHECKING STATE
  // ============================================

  if (checking) {
    return (
      <button
        type="button"
        disabled
        className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold px-6 sm:px-8 py-3 rounded-xl cursor-not-allowed"
      >
        Checking...
      </button>
    );
  }

  // ============================================
  // ALREADY APPLIED
  // ============================================

  if (applied) {
    return (
      <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold px-6 sm:px-8 py-3 rounded-xl">
        You have applied to this job.
      </div>
    );
  }

  // ============================================
  // APPLY BUTTON
  // ============================================

  return (
    <>
      {user?.loggedIn && user?.role === "employee" && (
        <button
          type="button"
          onClick={handleApply}
          disabled={submitting}
          className="bg-gradient-to-r from-primary to-primary hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg transition text-base sm:text-md btn-glow cursor-pointer"
        >
          {submitting ? "Applying..." : "Apply For This Role Now"}
        </button>
      )}
    </>
  );
}
