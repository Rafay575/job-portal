import axios from "axios";

type ApplyToJobResponse = {
  success: boolean;
  alreadyApplied?: boolean;
  message: string;
  application?: {
    id: number;
    jobId: number;
    userId: number;
  };
};

type CheckApplicationResponse = {
  success: boolean;
  applied: boolean;
  application: {
    id: number;
    jobId: number;
    userId: number;
    appliedAt: string;
  } | null;
};


export const applyToJob = async (
  jobId: number,
  userId: number
): Promise<ApplyToJobResponse> => {
  try {
    const response = await axios.post(
      "/api/jobs/apply-job",
      {
        jobId,
        userId,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    }

    throw new Error(
      "Failed to submit application."
    );
  }
};

export const checkJobApplication = async (
  jobId: number,
  userId: number
): Promise<CheckApplicationResponse> => {
  try {
    const response = await axios.get(
      `/api/jobs/check-apply?jobId=${jobId}&userId=${userId}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to check application status."
      );
    }

    throw new Error(
      "Failed to check application status."
    );
  }
};