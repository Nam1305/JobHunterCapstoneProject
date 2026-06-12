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
  pageSize?: number;
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
  async patchCloseJob(jobId: string){
    const res = await api.patch<ResponseEntity<JobPostDetail>>(`hr/jobs/${jobId}/close`);
    return res.data;
  }
};

export function useJobPostingsQuery(params: getJobPostingsParams) {
  return useQuery<ResponseEntity<PageResult<JobPosting>>, AxiosError>({
    queryKey: ["jobPostings", params],
    queryFn: () => jobApi.getJobPostings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useJobPostingDetailQuery(jobId: string, enabled = true) {
  return useQuery<ResponseEntity<JobPostDetail>, AxiosError>({
    queryKey: ["jobPostingDetail", jobId],
    queryFn: () => jobApi.getJobPostingDetail(jobId),
    enabled: enabled && Boolean(jobId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategoriesQuery({
  refetchOnMount,
}: {
  refetchOnMount?: boolean | "always";
} = {}) {
  return useQuery<JobPostingCategory[], AxiosError>({
    queryKey: ["categories"],
    queryFn: () => jobApi.getCategories(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount,
  });
}

export function useExperienceLevelsQuery({
  refetchOnMount,
}: {
  refetchOnMount?: boolean | "always";
} = {}) {
  return useQuery<ResponseEntity<ExperienceLevel[]>, AxiosError>({
    queryKey: ["experienceLevels"],
    queryFn: () => jobApi.getExperienceLevels(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount,
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

export function usePatchCloseJob(){
  return useMutation<ResponseEntity<JobPostDetail>, ApiError, string>({
    mutationFn: (jobId) => jobApi.patchCloseJob(jobId)
  });
}
