import { PageResult, ResponseEntity } from "@/types/base";
import api from "./api";
import {
  JobPostDetail,
  JobPosting,
  JobPostingCategory,
  UpdateJobPostRequest,
} from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface getJobPostingsParams {
  search?: string;
  status?: "Open" | "Closed";
  page?: number;
  limit?: number;
}

export const jobApi = {
  async getJobPostings(params: getJobPostingsParams) {
    const res = await api.get<ResponseEntity<PageResult<JobPosting>>>(
      "hr/jobs",
      {
        params,
      }
    );
    return res.data;
  },
  async getJobPostingDetail(jobId: string) {
    const res = await api.get<ResponseEntity<JobPostDetail>>(
      `hr/jobs/${jobId}`
    );
    return res.data;
  },
  async updateJobPosting(jobId: string, payload: UpdateJobPostRequest) {
    const res = await api.put<ResponseEntity<JobPostDetail>>(
      `hr/jobs/${jobId}`,
      payload
    );
    return res.data;
  },
  async getCategories() {
    const res = await api.get<JobPostingCategory[]>("categories");
    return res.data;
  },
};

export function useJobPostingsQuery(params: getJobPostingsParams) {
  return useQuery<ResponseEntity<PageResult<JobPosting>>, AxiosError>({
    queryKey: ["jobPostings", params],
    queryFn: () => jobApi.getJobPostings(params),
  });
}

export function useJobPostingDetailQuery(jobId: string) {
  return useQuery<ResponseEntity<JobPostDetail>, AxiosError>({
    queryKey: ["jobPostingDetail", jobId],
    queryFn: () => jobApi.getJobPostingDetail(jobId),
    enabled: Boolean(jobId),
  });
}

export function useCategoriesQuery() {
  return useQuery<JobPostingCategory[], AxiosError>({
    queryKey: ["categories"],
    queryFn: () => jobApi.getCategories(),
  });
}
