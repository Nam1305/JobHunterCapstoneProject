import { PageResult, ResponseEntity } from "@/types/base";
import api from "./api";
import {
  ExperienceLevel,
  JobPostDetail,
  JobPosting,
  JobPostingCategory,
  UpdateJobPostRequest,
} from "@/types/job";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiError = AxiosError<ResponseEntity<string>>;

export interface getJobPostingsParams {
  search?: string;
  status?: "Open" | "Closed";
  page?: number;
  limit?: number;
}

export interface UpdateJobPostingVariables {
  jobId: string;
  payload: UpdateJobPostRequest;
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
  async createJobPosting(
    payload: UpdateJobPostRequest
  ): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>(`hr/jobs`, payload);
    return res.data;
  },
  async getCategories() {
    const res = await api.get<JobPostingCategory[]>("categories");
    return res.data;
  },
  async getExperienceLevels() {
    const res =
      await api.get<ResponseEntity<ExperienceLevel[]>>("experienceLevels");
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
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useExperienceLevelsQuery() {
  return useQuery<ResponseEntity<ExperienceLevel[]>, AxiosError>({
    queryKey: ["experienceLevels"],
    queryFn: () => jobApi.getExperienceLevels(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useCreateJobPosting() {
  return useMutation<
    ResponseEntity<string>,
    ApiError,
    UpdateJobPostRequest
  >({
    mutationFn: jobApi.createJobPosting,
  });
}

export function useUpdateJobPosting() {
  return useMutation<
    ResponseEntity<JobPostDetail>,
    ApiError,
    UpdateJobPostingVariables
  >({
    mutationFn: ({ jobId, payload }) => jobApi.updateJobPosting(jobId, payload),
  });
}
