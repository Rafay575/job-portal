"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { RootState } from "@/lib/store";
import { getMyJobs, type MyJobApplication } from "@/lib/getJobs";

// ============================================================
// HELPERS
// ============================================================

const formatPositionType = (value: string) => {
  if (!value) return "";

  return value
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatAppliedDate = (date: string) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

const formatAppliedDateTime = (date: string) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
};

// ============================================================
// SKELETON CARD
// ============================================================

function JobSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm animate-pulse">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />

            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />

            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>

          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APPLICATION CARD
// ============================================================

type ApplicationCardProps = {
  application: MyJobApplication;
  index: number;
  onClick: () => void;
};

function ApplicationCard({
  application,
  index,
  onClick,
}: ApplicationCardProps) {
  const job = application.job;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.99,
      }}
    >
      <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* TOP ACCENT */}

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary opacity-80" />

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
          {/* LEFT */}

          <div className="min-w-0 flex-1">
            {/* BADGES */}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                ✓ Applied
              </span>

              <span className="bg-[#EDE9FE] dark:bg-primary/20 text-primary dark:text-primary-300 text-xs font-bold px-3 py-1.5 rounded-full">
                {formatPositionType(job.position_type)}
              </span>

              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full">
                {job.category}
              </span>
            </div>

            {/* TITLE */}

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {job.title}
            </h2>

            {/* OFFICE */}

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              {/* <span className="flex items-center gap-2">
                <FaBuilding className="text-primary shrink-0" />
                {job.office}
              </span> */}

              {job.unit && (
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary shrink-0" />
                  {job.unit}
                </span>
              )}
            </div>

            {/* LOCATION */}

            {/* {job.region && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <FaMapMarkerAlt className="text-primary" />
                {job.region}
              </div>
            )} */}
          </div>

          {/* VIEW BUTTON */}

          <div className="shrink-0">
            <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all duration-300">
              View Job
              <FaArrowRight className="text-sm" />
            </div>
          </div>
        </div>

        {/* INFORMATION */}

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* CATEGORY */}

            <div>
              <span className="block text-[11px] uppercase tracking-wide font-bold text-primary mb-1">
                Category
              </span>

              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {job.category || "N/A"}
              </span>
            </div>

            {/* POSITION */}

            <div>
              <span className="block text-[11px] uppercase tracking-wide font-bold text-primary mb-1">
                Position
              </span>

              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {formatPositionType(job.position_type) || "N/A"}
              </span>
            </div>

            {/* SALARY */}

            <div>
              <span className="block text-[11px] uppercase tracking-wide font-bold text-primary mb-1">
                Salary / Rate
              </span>

              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {job.salary || "Not specified"}
              </span>
            </div>

            {/* APPLIED DATE */}

            <div>
              <span className="block text-[11px] uppercase tracking-wide font-bold text-primary mb-1">
                Applied On
              </span>

              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {formatAppliedDate(application.appliedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FaClock className="text-primary size-4" />
            Applied {formatAppliedDateTime(application.appliedAt)}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function MyJobsPage() {
  const router = useRouter();
  const JOBS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state: RootState) => state.user);

  const [applications, setApplications] = useState<MyJobApplication[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.ceil(applications.length / JOBS_PER_PAGE);

  const paginatedApplications = applications.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );
  // ============================================================
  // FETCH APPLICATIONS
  // ============================================================

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.loggedIn || !user?.id) {
        setApplications([]);
        setLoading(false);
        return;
      }
      if (user?.role === "admin") {
        setLoading(false);

        toast.error("You are not authorized to access this page.");

        router.push("/admin/dashboard");

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getMyJobs(Number(user.id));

        if (response.success) {
          setApplications(response.data || []);
          setCurrentPage(1);
        } else {
          setApplications([]);
          setError("Unable to load your applications.");
        }
      } catch (error) {
        console.error("Failed to fetch my jobs:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load your applications.";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.id, user?.loggedIn]);

  // ============================================================
  // OPEN JOB
  // ============================================================

  const openJob = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!user?.loggedIn) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <FaBriefcase className="text-2xl" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Please Log In
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Please log in to view the jobs you have applied for.
          </p>

          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            Log In
          </button>
        </motion.div>
      </section>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <span className="inline-block text-primary font-bold uppercase tracking-widest text-xs mb-2">
              Career Activity
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              My Jobs
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
              View the roles you have applied for and quickly return to their
              job details.
            </p>
          </div>

          {/* APPLICATION COUNT */}

          {!loading && !error && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="self-start sm:self-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 shadow-sm"
            >
              <span className="block text-xs text-right uppercase font-bold text-slate-400">
                Applied Jobs
              </span>

              <span className="text-2xl font-extrabold text-primary">
                {applications.length}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <JobSkeleton key={item} />
          ))}
        </div>
      )}

      {/* ========================================================
          ERROR
      ======================================================== */}

      {!loading && error && (
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 rounded-2xl p-10 text-center"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Unable to load applications
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* ========================================================
          EMPTY
      ======================================================== */}

      {!loading && !error && applications.length === 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 sm:p-16 text-center shadow-sm"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
            <FaBriefcase className="text-3xl" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            No Applications Yet
          </h2>

          <p className="mt-3 max-w-md mx-auto text-slate-500 dark:text-slate-400">
            You haven't applied for any jobs yet. Browse our available vacancies
            and find your next opportunity.
          </p>

          <button
            type="button"
            onClick={() => router.push("/jobs")}
            className="mt-7 bg-primary text-white px-7 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md"
          >
            Browse Jobs
          </button>
        </motion.div>
      )}

      {/* ========================================================
          APPLICATIONS
      ======================================================== */}

      {!loading && !error && applications.length > 0 && (
        <>
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {paginatedApplications.map((application, index) => (
                <ApplicationCard
                  key={application.applicationId}
                  application={application}
                  index={index}
                  onClick={() => openJob(application.jobId)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="flex justify-center items-center gap-2 mt-10 flex-wrap"
            >
              {/* PREVIOUS */}
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition"
              >
                Previous
              </motion.button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    type="button"
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {page}
                  </motion.button>
                ),
              )}

              {/* NEXT */}
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition"
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}
