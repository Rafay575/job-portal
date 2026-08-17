import Link from "next/link";
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaGift,
  FaRegClock,
  FaUserCheck,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { getJobById } from "@/lib/getJobs";

import ApplyButton from "@/components/ApplyButton";
import AppliedBadge from "@/components/AppliedBadge";

type JobDetails = {
  sale_id: number;
  office: string;
  unit: string;
  postcode: string;
  region: string;
  region_id: number;
  region_distance_km: number;
  position_type: string;
  title: string;
  category: string;
  salary: string;
  timing: string;
  experience: string;
  qualification: string;
  benefits: string;
  status: string;
  created: string;
};

type JobDetailsResponse = {
  success: boolean;
  data: JobDetails | null;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatPositionType = (value: string) => {
  if (!value) return "";

  return value
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (date: string) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  let job: JobDetails | null = null;


  try {
    const response: JobDetailsResponse = await getJobById(id);

    if (response?.success && response?.data) {
      job = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch job details:", error);
  }

  // ============================================
  // JOB NOT FOUND / API ERROR
  // ============================================

  if (!job) {
    return (
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-10 sm:p-16 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-5xl mb-5">📂</div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Job Not Found
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-3">
            This vacancy may no longer be available or could not be loaded.
          </p>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 mt-7 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            <FaArrowLeft />
            Back to Job Listings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="py-5 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* ============================================
            BACK TO JOBS
        ============================================ */}

        <Link
          href="/jobs"
          className="inline-flex gap-2 items-center text-primary dark:text-brand-400 font-bold mb-5 hover:underline"
        >
          <FaArrowLeft />
          Back to Job Listings
        </Link>

        {/* ============================================
            MAIN CARD
        ============================================ */}

        <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-10">
          {/* ============================================
              JOB HEADER
          ============================================ */}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-700 pb-2 md:pb-6">
            {/* LEFT */}

            <div className="min-w-0">
              {/* BADGES */}

              <div className="flex items-center gap-2 mb-3 flex-wrap">
              <AppliedBadge saleId={job.sale_id} />
                <span className="bg-[#EDE9FE] dark:bg-brand-900 text-primary dark:text-brand-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  {formatPositionType(job.position_type)}
                </span>

                <span className="bg-[#EDE9FE] dark:bg-brand-900 text-primary dark:text-brand-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  {job.category}
                </span>
              </div>

              {/* TITLE */}

              <h1 className="text-xl! sm:text-2xl! lg:text-3xl! font-semibold text-slate-900 dark:text-white">
                {job.title}
              </h1>

              {/* OFFICE + UNIT */}

              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-y-1 gap-x-4 flex-wrap">
                {/* <span className="flex items-center gap-1">
                  <FaBuilding className="text-primary shrink-0" />
                  {job.office}
                </span> */}

                <span className="flex items-center gap-1">
                  <FaLocationDot className="text-primary shrink-0" />
                  {job.unit}
                </span>
              </p>
            </div>

            {/* RIGHT - SALARY */}

            <div className="md:text-right shrink-0 ">
              <span className="block text-xs uppercase text-primary font-bold">
                Salary / Rate
              </span>

              <span className="text-xl! sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {job.salary || "Not specified"}
              </span>
            </div>
          </div>

          {/* ============================================
              JOB SUMMARY
          ============================================ */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl">
            {/* CATEGORY */}

            <div>
              <span className="block text-xs uppercase text-primary font-bold mb-1">
                Category
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.category || "N/A"}
              </span>
            </div>

            {/* POSITION */}

            <div>
              <span className="block text-xs uppercase text-primary font-bold mb-1">
                Position Type
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {formatPositionType(job.position_type)}
              </span>
            </div>

            {/* REGION */}

            <div>
              <span className="block text-xs uppercase text-primary font-bold mb-1">
                Region
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.region || "N/A"}
              </span>
            </div>

            {/* POSTCODE */}

            <div>
              <span className="block text-xs uppercase text-primary font-bold mb-1">
                Postcode
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.postcode.split(" ")[0] || "N/A"}
              </span>
            </div>

            {/* DISTANCE */}

            <div>
              <span className="block text-xs uppercase text-primary font-bold mb-1">
                Distance
              </span>

              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.region_distance_km !== null &&
                job.region_distance_km !== undefined
                  ? `${job.region_distance_km} km`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* ============================================
              Timming
          ============================================ */}

          <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaRegClock className="text-primary shrink-0" />
              Timing
            </h3>

            {job.timing ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-slate-500">
                {job.timing}
              </div>
            ) : (
              <p className="text-slate-500">No timing information provided.</p>
            )}
          </div>

          {/* ============================================
              EXPERIENCE
          ============================================ */}
          <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaBriefcase className="text-primary shrink-0" />
              Experience
            </h3>

            {job.experience ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-slate-500">
                {job.experience}
              </div>
            ) : (
              <p className="text-slate-500">
                No experience information provided.
              </p>
            )}
          </div>

          {/* ============================================
              QUALIFICATION
          ============================================ */}

          <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaUserCheck className="text-primary shrink-0" />
              Qualification
            </h3>

            {job.qualification ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-slate-500">
                {job.qualification}
              </div>
            ) : (
              <p className="text-slate-500">
                No qualification information provided.
              </p>
            )}
          </div>

          {/* ============================================
              BENEFITS
          ============================================ */}

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FaGift className="text-primary shrink-0" />
              Benefits
            </h3>

            {job.benefits ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed">
                {job.benefits}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-slate-500">
                No benefits information provided.
              </div>
            )}
          </div>

          {/* ============================================
              APPLY SECTION
          ============================================ */}

          <div className="border-t border-slate-100 dark:border-slate-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

              <ApplyButton saleId={job.sale_id} />

            <div className="text-sm text-slate-500 text-center sm:text-right">
              <p className="mt-1">Posted {formatDate(job.created)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
