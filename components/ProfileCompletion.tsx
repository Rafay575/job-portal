"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function ProfileCompletion(step: any) {
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.id) return;

    const fetchProfileProgress = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/profile-progress?id=${user.id}`);

        if (
          response.data?.success &&
          typeof response.data.percentage === "number"
        ) {
          setPercentage(response.data.percentage);
        }
      } catch (error) {
        console.error("Failed to fetch profile progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileProgress();
  }, [user.id,step]);

  if (loading) {
    return (
      <div className="rounded-lg bg-muted/50 p-3 mt-4">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted/50 p-3 mt-4">
      <div className="flex flex-col items-start justify-between">
        <p className="text-sm font-medium">Profile Completion: {percentage}%</p>

        <span className="text-xs text-muted-foreground">
          {percentage === 100 ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted border border-primary/20!">
        <div
          className="h-full rounded-full bg-primary "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
