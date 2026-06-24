import { ResponseEntity } from "@/types/base";
import {
  ApplicationResult,
  ApplyJobRequest,
  JobApplicationStatus,
  Resume,
  UpdateResumeStatusRequest,
} from "@/types/candidate";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { AxiosError } from "axios";

type ApiError = AxiosError<ResponseEntity<null>>;

function toRepeatedQueryParams(key: string, values: string[]) {
  const params = new URLSearchParams();
  values.forEach((value) => params.append(key, value));
  return params;
}

export interface LikedJobsStatus {
  likedJobIds: string[];
}

export interface LikedCompaniesStatus {
  likedCompanyIds: string[];
}

export interface FollowingToggleResult {
  isLiked: boolean;
}

const likedJobsStatusRoot = [
  "candidate",
  "following",
  "jobs",
  "liked-status",
] as const;

const likedCompaniesStatusRoot = [
  "candidate",
  "following",
  "companies",
  "liked-status",
] as const;

export const candidateQueryKeys = {
  resumes: ["candidate", "resumes"] as const,
  applicationStatus: (jobId: string) =>
    ["candidate", "applications", jobId, "status"] as const,
  likedJobsStatusRoot,
  likedJobsStatus: (jobIds: string[]) =>
    [...likedJobsStatusRoot, jobIds] as const,
  likedCompaniesStatusRoot,
  likedCompaniesStatus: (companyIds: string[]) =>
    [...likedCompaniesStatusRoot, companyIds] as const,
};

export interface UpdateResumeStatusVariables {
  resumeId: string;
  payload: UpdateResumeStatusRequest;
}

export const candidateApi = {
  async getResumes(): Promise<ResponseEntity<Resume[]>> {
    const res = await api.get<ResponseEntity<Resume[]>>("candidate/resumes");
    return res.data;
  },

  async uploadResume(file: File): Promise<ResponseEntity<Resume>> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<ResponseEntity<Resume>>(
      "candidate/resumes",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  async updateResumeStatus(
    resumeId: string,
    payload: UpdateResumeStatusRequest
  ): Promise<ResponseEntity<Resume>> {
    const res = await api.patch<ResponseEntity<Resume>>(
      `candidate/resumes/${resumeId}/status`,
      payload
    );
    return res.data;
  },

  async deleteResume(resumeId: string): Promise<ResponseEntity<null>> {
    const res = await api.delete<ResponseEntity<null>>(
      `candidate/resumes/${resumeId}`
    );
    return res.data;
  },

  async applyJob(
    payload: ApplyJobRequest
  ): Promise<ResponseEntity<ApplicationResult>> {
    const res = await api.post<ResponseEntity<ApplicationResult>>(
      "candidate/applications",
      payload
    );
    return res.data;
  },

  async getApplicationStatus(
    jobId: string
  ): Promise<ResponseEntity<JobApplicationStatus>> {
    const res = await api.get<ResponseEntity<JobApplicationStatus>>(
      `candidate/applications/${jobId}/status`
    );
    return res.data;
  },

  async toggleJobLike(
    jobId: string
  ): Promise<ResponseEntity<FollowingToggleResult>> {
    const res = await api.post<ResponseEntity<FollowingToggleResult>>(
      `candidate/following/jobs/${jobId}`
    );
    return res.data;
  },

  async toggleCompanyLike(
    companyId: string
  ): Promise<ResponseEntity<FollowingToggleResult>> {
    const res = await api.post<ResponseEntity<FollowingToggleResult>>(
      `candidate/following/companies/${companyId}`
    );
    return res.data;
  },

  async getLikedJobsStatus(
    jobIds: string[]
  ): Promise<ResponseEntity<LikedJobsStatus>> {
    const res = await api.get<ResponseEntity<LikedJobsStatus>>(
      "candidate/following/jobs/liked-status",
      {
        params: toRepeatedQueryParams("jobIds", jobIds),
      }
    );
    return res.data;
  },

  async getLikedCompaniesStatus(
    companyIds: string[]
  ): Promise<ResponseEntity<LikedCompaniesStatus>> {
    const res = await api.get<ResponseEntity<LikedCompaniesStatus>>(
      "candidate/following/companies/liked-status",
      {
        params: toRepeatedQueryParams("companyIds", companyIds),
      }
    );
    return res.data;
  },
};

export function useCandidateResumesQuery(enabled = true) {
  return useQuery<ResponseEntity<Resume[]>, ApiError>({
    queryKey: candidateQueryKeys.resumes,
    queryFn: candidateApi.getResumes,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadResumeMutation() {
  return useMutation<ResponseEntity<Resume>, ApiError, File>({
    mutationFn: candidateApi.uploadResume,
  });
}

export function useUpdateResumeStatusMutation() {
  return useMutation<
    ResponseEntity<Resume>,
    ApiError,
    UpdateResumeStatusVariables
  >({
    mutationFn: ({ resumeId, payload }) =>
      candidateApi.updateResumeStatus(resumeId, payload),
  });
}

export function useDeleteResumeMutation() {
  return useMutation<ResponseEntity<null>, ApiError, string>({
    mutationFn: candidateApi.deleteResume,
  });
}

export function useApplyJobMutation() {
  return useMutation<
    ResponseEntity<ApplicationResult>,
    ApiError,
    ApplyJobRequest
  >({
    mutationFn: candidateApi.applyJob,
  });
}

export function useApplicationStatusQuery(jobId: string, enabled = true) {
  return useQuery<ResponseEntity<JobApplicationStatus>, ApiError>({
    queryKey: candidateQueryKeys.applicationStatus(jobId),
    queryFn: () => candidateApi.getApplicationStatus(jobId),
    enabled: enabled && Boolean(jobId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleJobLikeMutation() {
  return useMutation<ResponseEntity<FollowingToggleResult>, ApiError, string>({
    mutationFn: candidateApi.toggleJobLike,
  });
}

export function useToggleCompanyLikeMutation() {
  return useMutation<ResponseEntity<FollowingToggleResult>, ApiError, string>({
    mutationFn: candidateApi.toggleCompanyLike,
  });
}

export function useLikedJobsStatusQuery(jobIds: string[], enabled = true) {
  return useQuery<ResponseEntity<LikedJobsStatus>, ApiError>({
    queryKey: candidateQueryKeys.likedJobsStatus(jobIds),
    queryFn: () => candidateApi.getLikedJobsStatus(jobIds),
    enabled: enabled && jobIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLikedCompaniesStatusQuery(
  companyIds: string[],
  enabled = true
) {
  return useQuery<ResponseEntity<LikedCompaniesStatus>, ApiError>({
    queryKey: candidateQueryKeys.likedCompaniesStatus(companyIds),
    queryFn: () => candidateApi.getLikedCompaniesStatus(companyIds),
    enabled: enabled && companyIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
