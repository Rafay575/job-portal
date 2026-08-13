export type Job = {
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
  last_updated: string;
};

export type JobsResponse = {
  success: boolean;
  data: Job[];
};