"use client";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaFireAlt, FaRegClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import toast from "react-hot-toast";
import { getAllJobs } from "@/lib/getJobs";
import type { Job } from "@/types/job";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { checkJobApplication } from "@/lib/appliedJobs";

type Filters = {
  search: string;
  category: string;
  region: string;
  positionType: string;
};

const JOBS_PER_PAGE = 6;

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});

  // Applied filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    region: "",
    positionType: "",
  });

  // Temporary filter values
  const [filterValues, setFilterValues] = useState<Filters>({
    search: "",
    category: "",
    region: "",
    positionType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!searchParams) return;

    const search = searchParams.get("search") ?? "";
    const region = searchParams.get("region") ?? "";

    setFilters((prev) => ({
      ...prev,
      search,
      region,
    }));

    setFilterValues((prev) => ({
      ...prev,
      search,
      region,
    }));

    setCurrentPage(1);
  }, [searchParams]);

  // ============================================
  // FETCH JOBS
  // ============================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await getAllJobs();

        console.log("Jobs API response:", response);

        /*
          Your API response is:

          {
            success: true,
            data: [...]
          }

          Therefore we need response.data
        */

        if (response?.success && Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          setJobs([]);
          toast.error("No jobs data was returned.");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);

        toast.error(
          error instanceof Error ? error.message : "Failed to fetch jobs data.",
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ============================================
  // FILTER OPTIONS
  // ============================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.category).filter(Boolean)),
    ).sort();
  }, [jobs]);

  const regions = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.region).filter(Boolean)),
    ).sort();
  }, [jobs]);

  const positionTypes = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.position_type).filter(Boolean)),
    ).sort();
  }, [jobs]);

  // ============================================
  // APPLY FILTERS
  // ============================================

  const applyFilters = () => {
    setFilters(filterValues);
    setCurrentPage(1);

    const params = new URLSearchParams();

    if (filterValues.search.trim()) {
      params.set("search", filterValues.search.trim());
    }

    if (filterValues.region.trim()) {
      params.set("region", filterValues.region.trim());
    }

    const queryString = params.toString();

    window.history.replaceState(
      null,
      "",
      queryString ? `/jobs?${queryString}` : "/jobs",
    );
  };

  // ============================================
  // RESET FILTERS
  // ============================================

  const resetFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      region: "",
      positionType: "",
    };

    setFilterValues(emptyFilters);
    setFilters(emptyFilters);
    setCurrentPage(1);

    window.history.replaceState(null, "", "/jobs");
  };

  // ============================================
  // FILTER JOBS
  // ============================================

  const filteredJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const region = filters.region.trim().toLowerCase();

    const category = filters.category.trim().toLowerCase();

    const positionType = filters.positionType.trim().toLowerCase();

    return jobs.filter((job) => {
      // =====================================
      // SEARCH
      // Search across:
      // title
      // unit
      // category
      // =====================================

      const searchMatch =
        !search ||
        job.title?.toLowerCase().includes(search) ||
        job.unit?.toLowerCase().includes(search) ||
        job.category?.toLowerCase().includes(search);

      // =====================================
      // REGION
      // =====================================

      const regionMatch = !region || job.region?.toLowerCase() === region;

      // =====================================
      // CATEGORY
      // =====================================

      const categoryMatch =
        !category || job.category?.toLowerCase() === category;

      // =====================================
      // POSITION TYPE
      // =====================================

      const positionTypeMatch =
        !positionType || job.position_type?.toLowerCase() === positionType;

      return searchMatch && regionMatch && categoryMatch && positionTypeMatch;
    });
  }, [jobs, filters]);

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;

    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // ============================================
  // PAGE CHANGE
  // ============================================

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================
  // FORMAT TEXT
  // ============================================

  const formatPositionType = (value: string) => {
    if (!value) return "";

    return value
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // ============================================
  // FORMAT LAST UPDATED
  // ============================================

  const formatDate = (date: string) => {
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

  // ============================================
  // PAGINATION NUMBERS
  // ============================================

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };
  useEffect(() => {
    if (!user?.loggedIn || !user?.id || paginatedJobs.length === 0) {
      setAppliedJobs({});
      return;
    }

    const checkApplications = async () => {
      try {
        const results = await Promise.all(
          paginatedJobs.map(async (job) => {
            try {
              const response = await checkJobApplication(
                job.sale_id,
                Number(user.id),
              );

              return {
                jobId: job.sale_id,
                applied: response.success ? response.applied : false,
              };
            } catch (error) {
              console.error(`Failed to check job ${job.sale_id}:`, error);

              return {
                jobId: job.sale_id,
                applied: false,
              };
            }
          }),
        );

        const appliedMap: Record<number, boolean> = {};

        results.forEach((item) => {
          appliedMap[item.jobId] = item.applied;
        });

        setAppliedJobs(appliedMap);
      } catch (error) {
        console.error("Failed to check job applications:", error);
      }
    };

    checkApplications();
  }, [paginatedJobs, user?.id, user?.loggedIn]);

  const formatRelativeTime = (date: string) => {
    if (!date) return "N/A";

    const createdDate = new Date(date);
    const now = new Date();

    if (isNaN(createdDate.getTime())) {
      return "N/A";
    }

    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000,
    );

    // Future date
    if (diffInSeconds < 0) {
      return "Just now";
    }

    // Less than 1 minute
    if (diffInSeconds < 60) {
      return "Just now";
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }

    // Years
    const diffInYears = Math.floor(diffInDays / 365);

    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* =========================
          PAGE HEADER
      ========================== */}

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <motion.span
          className="text-primary font-bold uppercase tracking-widest text-xs! mb-2 block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          Live Opportunities
        </motion.span>

        <motion.h1
          className="text-3xl! sm:text-4xl! font-extrabold mb-4 text-slate-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          Browse All Healthcare Vacancies
        </motion.h1>

        <motion.p
          className="text-slate-600 dark:text-slate-400 text-lg!"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut",
          }}
        >
          Filter through live verified roles across the United Kingdom by
          category, unit, or position type.
        </motion.p>
      </motion.div>

      {/* =========================
          FILTER BAR
      ========================== */}

      <motion.div
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100! dark:border-slate-700 mb-10"
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.35,
          ease: "easeOut",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Search Jobs
            </label>

            <input
              type="text"
              value={filterValues.search}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              placeholder="Job title, unit, category..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
            />
          </div>

          {/* =========================
              CATEGORY
          ========================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.5,
            }}
          >
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Job Category
            </label>

            <select
              value={filterValues.category}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </motion.div>

          {/* =========================
              REGION
          ========================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
            }}
          >
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Region
            </label>

            <select
              value={filterValues.region}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  region: e.target.value,
                }))
              }
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
            >
              <option value="">All UK Regions</option>

              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </motion.div>

          {/* =========================
              POSITION TYPE
          ========================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.55,
              duration: 0.5,
            }}
          >
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Position Type
            </label>

            <select
              value={filterValues.positionType}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  positionType: e.target.value,
                }))
              }
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
            >
              <option value="">All Types</option>

              {positionTypes.map((type) => (
                <option key={type} value={type}>
                  {formatPositionType(type)}
                </option>
              ))}
            </select>
          </motion.div>

          {/* =========================
              BUTTONS
          ========================== */}

          <motion.div
            className="flex items-end gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
            }}
          >
            <button
              onClick={applyFilters}
              className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-bold p-3 rounded-xl shadow-md transition btn-glow cursor-pointer md:min-w-[200px] text-center"
            >
              Apply Filters
            </button>

            <button
              onClick={resetFilters}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              Reset
            </button>
          </motion.div>
        </div>

        {/* Result count */}

        {!loading && (
          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {filteredJobs.length}
            </span>{" "}
            {filteredJobs.length === 1 ? "vacancy" : "vacancies"}
          </div>
        )}
      </motion.div>

      {/* =========================
          JOB LISTING
      ========================== */}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 animate-pulse"
            >
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4" />

              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />

              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />

              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {paginatedJobs.length === 0 ? (
              <motion.div
                key="empty"
                className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center border border-slate-200 dark:border-slate-700"
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div className="text-4xl text-slate-400 mb-4">📂</div>

                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  No matching vacancies found
                </h3>

                <p className="text-slate-500 text-sm mb-6">
                  Try adjusting your filter settings to see more results.
                </p>

                <button
                  onClick={resetFilters}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              paginatedJobs.map((job, index) => (
                <motion.div
                  key={job.sale_id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 70,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -5,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  className="job-card bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md border border-slate-100! dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-2xl transition duration-300 group"
                >
                  {/* =========================
                      JOB INFORMATION
                  ========================== */}

                  <div className="space-y-2 flex-1 min-w-0">
                    {job.created && (
                      <div className="text-slate-500 mb-1">
                        <p className="mt-1 text-[12px]!">
                          Posted {formatRelativeTime(job.created)}
                        </p>
                      </div>
                    )}

                    {/* BADGES */}

                    {/* TITLE */}

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition">
                      {job.title}
                    </h3>

                    {/* COMPANY / unit */}

                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center flex-wrap gap-4">
                      <span className="flex items-center gap-1">
                        <FaLocationDot className="text-primary shrink-0" />

                        <span>{job.unit}</span>
                      </span>
                    </p>

                    {/* REGION */}

                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      {job.region && <span>📍 {job.region}</span>}

                      {/* {job.postcode && <span>{job.postcode}</span>} */}
                      {job.postcode && (
                        <span>{job.postcode.split(" ")[0]}</span>
                      )}

                      {/* {job.region_distance_km !== undefined && (
                        <span>{job.region_distance_km} km away</span>
                      )} */}
                    </div>

                    {/* TIMING */}

                    {job.timing && (
                      <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <FaRegClock className="text-primary mt-1 shrink-0" />

                        <span className="line-clamp-2">{job.timing}</span>
                      </div>
                    )}

                    {/* QUALIFICATION */}

                    {job.qualification && (
                      <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Qualification:
                        </span>{" "}
                        {job.qualification}
                      </div>
                    )}

                    {/* LAST UPDATED */}

                    {job.last_updated && (
                      <div className="text-xs text-slate-400">
                        Last updated: {formatDate(job.last_updated)}
                      </div>
                    )}
                    <motion.div
                      className="flex items-center gap-2 flex-wrap "
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: index * 0.08 + 0.2,
                      }}
                    >
                      {/* APPLIED BADGE */}

                      {user?.loggedIn && appliedJobs[job.sale_id] && (
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                          ✓ Applied
                        </span>
                      )}

                      {/* POSITION TYPE */}

                      <span className="bg-[#EDE9FE] dark:bg-primary/50 text-primary dark:text-primary-300 text-xs font-bold px-3 py-1.5 rounded-full">
                        {formatPositionType(job.position_type)}
                      </span>

                      {/* CATEGORY */}

                      <span className="bg-[#EDE9FE] dark:bg-brand-900 text-primary dark:text-brand-300 text-xs font-bold px-3 py-1.5 rounded-full">
                        {job.category || "Healthcare"}
                      </span>
                    </motion.div>
                  </div>

                  {/* =========================
                      SALARY + APPLY
                  ========================== */}

                  <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-700"
                    initial={{
                      opacity: 0,
                      x: 40,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.08 + 0.25,
                      duration: 0.5,
                    }}
                  >
                    <div className="text-left sm:text-right max-w-xs">
                      <span className="block text-xs text-slate-400 uppercase font-bold mb-1">
                        Salary
                      </span>

                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {job.salary || "Salary not specified"}
                      </span>
                    </div>

                    <Link
                      href={`/jobs/${job.sale_id}`}
                      className="w-full sm:w-auto"
                    >
                      <Link href={`/jobs/${job.sale_id}`}>
                        <button className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-bold px-6 py-3 rounded-xl transition shadow-md w-full sm:w-auto text-center btn-glow cursor-pointer">
                          View & Apply
                        </button>
                      </Link>
                    </Link>
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* =========================
          PAGINATION
      ========================== */}

      {!loading && totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center mt-12 gap-2 flex-wrap"
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut",
          }}
        >
          {/* PREVIOUS */}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition font-bold flex items-center justify-center"
          >
            <IoIosArrowRoundForward className="rotate-180 text-2xl" />
          </motion.button>

          {/* PAGE NUMBERS */}

          {getPaginationPages().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-slate-400"
                >
                  ...
                </span>
              );
            }

            return (
              <motion.button
                key={page}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => goToPage(page as number)}
                className={`w-10 h-10 rounded-xl font-bold transition ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white"
                }`}
              >
                {page}
              </motion.button>
            );
          })}

          {/* NEXT */}

          <motion.button
            whileHover={{ scale: 1.08, x: 3 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition font-bold flex items-center justify-center"
          >
            <IoIosArrowRoundForward className="text-2xl" />
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
