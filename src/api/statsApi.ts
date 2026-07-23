import { apiClient } from "./client";

export type StatsResponse = {
  resumes24h: number;
  jobsTotal: number;
  candidatesTotal: number;
};

export type PopularJobItem = {
  title: string;
  rank: number;
};

export type PopularJobsResponse = {
  items: PopularJobItem[];
};

export const statsApi = {
  getStats: () => apiClient.get<StatsResponse>("/stats"),
  getPopularJobs: (limit: number) =>
    apiClient.get<PopularJobsResponse>(`/jobs/popular?limit=${limit}`),
};
