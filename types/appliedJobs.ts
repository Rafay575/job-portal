// lib/types/appliedJobs.ts

export type AppliedJob = {
  applicationId: number;
  appliedAt: string;

  user: {
    id: number;
    name: string;
    email: string;
  };

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
    created: string;
  };
};

export type GroupedUserApplications = {
  user: AppliedJob["user"];

  applications: AppliedJob[];

  totalApplications: number;

  latestAppliedAt: string;
};