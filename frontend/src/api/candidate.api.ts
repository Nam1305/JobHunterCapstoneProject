import { ResponseEntity } from "@/types/base";
import {
  ApplicationResult,
  ApplyJobRequest,
  Resume,
  UpdateResumeStatusRequest,
} from "@/types/candidate";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { AxiosError } from "axios";

type ApiError = AxiosError<ResponseEntity<null>>;

export const candidateQueryKeys = {
  resumes: ["candidate", "resumes"] as const,
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
};

export function useCandidateResumesQuery() {
  return useQuery<ResponseEntity<Resume[]>, ApiError>({
    queryKey: candidateQueryKeys.resumes,
    queryFn: candidateApi.getResumes,
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
