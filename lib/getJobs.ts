import { Job } from "@/types/job";
import axios from "axios";
import type { AppliedJob } from "@/types/appliedJobs";

export type JobDetailsResponse = {
  success: boolean;
  data: Job;
};
export const getAllJobs = async () => {
  try {
    const response = await axios.get("/api/jobs");

    return response.data;
  } catch (error) {
    console.error("Error fetching all jobs:", error);

    throw error;
  }
};

export const getJobById = async (
  id: string | number
): Promise<JobDetailsResponse> => {
  try {
    const response = await axios.get(
      `${process.env.SALES_API}/api/sales/details/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SALES_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching job ${id}:`,
      error
    );

    throw error;
  }
};


// --------------------------------------------------------------------------------------------
// --------------------------------My JOBs function ----------------------------------------------
// --------------------------------------------------------------------------------------------


export type MyJobApplication = {
  applicationId: number;
  jobId: number;
  appliedAt: string;

  job: {
    sale_id: number;
    title: string;
    category: string;
    position_type: string;
    salary: string;
    office: string;
    unit: string;
    region: string;
    status: string;
  };
};

export type MyJobsResponse = {
  success: boolean;
  total: number;
  data: MyJobApplication[];
};

export async function getMyJobs(
  userId: number
): Promise<MyJobsResponse> {
  const response = await fetch(
    `/api/jobs/my-jobs/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch your applications."
    );
  }

  return data;
}



// --------------------------------------------------------------------------------------------
// --------------------------------My JOBs Admin function ----------------------------------------------
// --------------------------------------------------------------------------------------------

// lib/getAppliedJobs.ts


export type AppliedJobsResponse = {
  success: boolean;
  data: AppliedJob[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  filters: {
    categories: string[];
    positionTypes: string[];
  };
};

export async function getAppliedJobs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  positionType?: string;
}): Promise<AppliedJobsResponse> {
  const query = new URLSearchParams();

  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? 100));

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.positionType) {
    query.set("positionType", params.positionType);
  }

  const response = await fetch(
    `/api/jobs/applied-jobs?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch applied jobs"
    );
  }

  return response.json();
}