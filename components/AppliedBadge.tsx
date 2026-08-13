"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { checkJobApplication } from "@/lib/appliedJobs";

type AppliedBadgeProps = {
  saleId: number;
};

export default function AppliedBadge({
  saleId,
}: AppliedBadgeProps) {
  const user = useSelector(
    (state: RootState) => state.user
  );

  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkApplication = async () => {
      if (!user?.loggedIn || !user?.id) {
        setApplied(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        const response = await checkJobApplication(
          saleId,
          Number(user.id)
        );

        if (response.success) {
          setApplied(response.applied);
        }
      } catch (error) {
        console.error(
          "Failed to check application status:",
          error
        );

        setApplied(false);
      } finally {
        setChecking(false);
      }
    };

    checkApplication();
  }, [saleId, user?.id, user?.loggedIn]);

  if (checking || !applied) {
    return null;
  }

  return (
    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
      ✓ Applied
    </span>
  );
}