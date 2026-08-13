"use client";

import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { GroupedUserApplications } from "@/types/appliedJobs";

// ============================================================
// FORMAT DATE TIME
// ============================================================

export const formatDateTime = (date: string) => {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
};

// ============================================================
// FORMAT POSITION TYPE
// ============================================================

const formatPositionType = (value: string) => {
  if (!value) return "N/A";

  return value
    .split(/[\s_-]+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

// ============================================================
// PROPS
// ============================================================

type Props = {
  user: GroupedUserApplications | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ============================================================
// COMPONENT
// ============================================================

export default function UserApplicationsDialog({
  user,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();

  /*
   * IMPORTANT:
   * Hook must be called before any conditional return.
   */

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-1rem)]
          sm:w-[calc(100%-2rem)]
          max-w-5xl!
          max-h-[95vh]
          sm:max-h-[90vh]
          p-0
          overflow-hidden
          rounded-2xl
        "
      >
        {/* ========================================================
            HEADER
        ======================================================== */}

        <DialogHeader
          className="
            px-4
            py-4
            sm:px-6
            sm:py-5
            border-b
            bg-white
            dark:bg-slate-950
          "
        >
          <div className="flex items-start gap-3 sm:gap-4 pr-6">
            {/* ICON */}

            <div
              className="
                w-10
                h-10
                sm:w-12
                sm:h-12
                rounded-xl
                bg-primary/10
                text-primary
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <FaBriefcase className="text-lg sm:text-xl" />
            </div>

            {/* USER INFO */}

            <div className="min-w-0 flex-1">
              <DialogTitle
                className="
                  text-lg
                  sm:text-xl
                  md:text-2xl
                  font-bold
                  truncate
                "
              >
                {user.user.name}
              </DialogTitle>

              <p
                className="
                  text-xs
                  sm:text-sm
                  text-muted-foreground
                  mt-1
                  break-all
                  line-clamp-2
                "
              >
                {user.user.email}
              </p>

              <div className="mt-2 sm:mt-3">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-primary/10
                    text-primary
                    px-2.5
                    sm:px-3
                    py-1
                    text-[10px]
                    sm:text-xs
                    font-bold
                  "
                >
                  {user.totalApplications}{" "}
                  {user.totalApplications === 1
                    ? "Application"
                    : "Applications"}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* ========================================================
            APPLICATIONS
        ======================================================== */}

        <div
          className="
            overflow-y-auto
            px-3
            py-3
            sm:px-5
            sm:py-5
            md:px-6
            space-y-3
            sm:space-y-4
            max-h-[calc(95vh-120px)]
            sm:max-h-[calc(90vh-130px)]
          "
        >
          {user.applications.map((application, index) => {
            const job = application.job;

            return (
              <motion.div
                key={application.applicationId}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                }}
                className="
                  group
                  relative
                  border
                  rounded-xl
                  sm:rounded-2xl
                  overflow-hidden
                  p-4
                  sm:p-5
                  bg-white
                  dark:bg-slate-900
                  hover:shadow-md
                  transition-shadow
                "
              >
                {/* LEFT ACCENT */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    bottom-0
                    w-1
                    bg-primary
                  "
                />

                <div className="flex flex-col gap-4">
                  {/* ==================================================
                      JOB HEADER
                  ================================================== */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0 flex-1">
                      {/* BADGES */}

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                        {job.category && (
                          <span
                            className="
                              text-[10px]
                              sm:text-xs
                              font-bold
                              px-2
                              sm:px-2.5
                              py-1
                              rounded-full
                              bg-primary/10
                              text-primary
                            "
                          >
                            {job.category}
                          </span>
                        )}

                        {job.position_type && (
                          <span
                            className="
                              text-[10px]
                              sm:text-xs
                              font-bold
                              px-2
                              sm:px-2.5
                              py-1
                              rounded-full
                              bg-slate-100
                              dark:bg-slate-800
                              text-slate-700
                              dark:text-slate-300
                            "
                          >
                            {formatPositionType(
                              job.position_type
                            )}
                          </span>
                        )}
                      </div>

                      {/* TITLE */}

                      <h3
                        className="
                          font-bold
                          text-base
                          sm:text-lg
                          text-slate-900
                          dark:text-white
                          leading-snug
                          break-words
                        "
                      >
                        {job.title || "Job unavailable"}
                      </h3>
                    </div>

                    {/* APPLIED BADGE */}

                    <span
                      className="
                        self-start
                        shrink-0
                        text-[10px]
                        sm:text-xs
                        font-bold
                        px-2.5
                        sm:px-3
                        py-1.5
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        dark:bg-emerald-900/30
                        dark:text-emerald-400
                      "
                    >
                      Applied
                    </span>
                  </div>

                  {/* ==================================================
                      JOB DETAILS
                  ================================================== */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-x-5
                      gap-y-3
                      text-xs
                      sm:text-sm
                    "
                  >
                    {/* SALARY */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        min-w-0
                        text-muted-foreground
                      "
                    >
                      <FaMoneyBillWave
                        className="
                          text-emerald-500
                          shrink-0
                          mt-0.5
                        "
                      />

                      <span className="break-words">
                        {job.salary ||
                          "Salary not specified"}
                      </span>
                    </div>

                    {/* OFFICE */}

                    {job.office && (
                      <div
                        className="
                          flex
                          items-start
                          gap-2
                          min-w-0
                          text-muted-foreground
                        "
                      >
                        <FaBuilding
                          className="
                            text-primary
                            shrink-0
                            mt-0.5
                          "
                        />

                        <span className="break-words">
                          {job.office}
                        </span>
                      </div>
                    )}

                    {/* REGION */}

                    {job.region && (
                      <div
                        className="
                          flex
                          items-start
                          gap-2
                          min-w-0
                          text-muted-foreground
                        "
                      >
                        <FaMapMarkerAlt
                          className="
                            text-primary
                            shrink-0
                            mt-0.5
                          "
                        />

                        <span className="break-words">
                          {job.region}
                        </span>
                      </div>
                    )}

                    {/* APPLIED DATE */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        min-w-0
                        text-muted-foreground
                      "
                    >
                      <FaCalendarAlt
                        className="
                          text-primary
                          shrink-0
                          mt-0.5
                        "
                      />

                      <span className="break-words">
                        {formatDateTime(
                          application.appliedAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ==================================================
                      FOOTER
                  ================================================== */}

                  <div
                    className="
                      pt-3
                      border-t
                      flex
                      flex-col-reverse
                      xs:flex-row
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-3
                    "
                  >
                    {/* APPLICATION ID */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[10px]
                        sm:text-xs
                        text-muted-foreground
                      "
                    >
                      <FaClock
                        className="
                          text-primary
                          size-3.5
                          sm:size-4
                          shrink-0
                        "
                      />

                      <span>
                        Application #
                        {application.applicationId}
                      </span>
                    </div>

                    {/* VIEW DETAILS */}

                    <Button
                      type="button"
                      size="sm"
                      className="
                        w-full
                        sm:w-auto
                        text-xs
                        sm:text-sm
                        bg-primary
                        text-white
                        hover:bg-primary/90
                        gap-2
                      "
                      onClick={() => {
                        onOpenChange(false);

                        router.push(
                          `/jobs/${application.applicationId}`
                        );
                      }}
                    >
                      <span>View Details</span>

                      <FaExternalLinkAlt className="text-[10px]" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}