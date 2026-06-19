import { PageResult, ResponseEntity } from "@/types/base";
import {
  HrRecruitmentApplicationDetail,
  HrRecruitmentCandidate,
  HrRecruitmentCandidatesParams,
  HrRecruitmentJobItem,
  HrRecruitmentJobsParams,
  UpdateApplicationStatusRequest,
} from "@/types/hr-recruitment";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { AxiosError } from "axios";

type ApiError = AxiosError<ResponseEntity<null>>;

export const hrRecruitmentQueryKeys = {
  jobs: (params: HrRecruitmentJobsParams) =>
    ["hrRecruitment", "jobs", params] as const,
  candidates: (params: HrRecruitmentCandidatesParams) =>
    ["hrRecruitment", "candidates", params] as const,
  applicationDetail: (applicationId: string) =>
    ["hrRecruitment", "applicationDetail", applicationId] as const,
};

export interface UpdateApplicationStatusVariables {
  applicationId: string;
  payload: UpdateApplicationStatusRequest;
}

export const hrRecruitmentApi = {
  async getJobs(
    params: HrRecruitmentJobsParams
  ): Promise<ResponseEntity<PageResult<HrRecruitmentJobItem>>> {
    const res = await api.get<
      ResponseEntity<PageResult<HrRecruitmentJobItem>>
    >("hr/jobs/application-summary", { params });
    return res.data;
  },

  async getCandidates({
    jobId,
    ...params
  }: HrRecruitmentCandidatesParams): Promise<
    ResponseEntity<PageResult<HrRecruitmentCandidate>>
  > {
    const res = await api.get<
      ResponseEntity<PageResult<HrRecruitmentCandidate>>
    >(`hr/jobs/${jobId}/candidates`, { params });
    return res.data;
  },

  async getApplicationDetail(
    applicationId: string
  ): Promise<ResponseEntity<HrRecruitmentApplicationDetail>> {
    const res = await api.get<ResponseEntity<HrRecruitmentApplicationDetail>>(
      `hr/applications/${applicationId}`
    );
    return res.data;
  },

  async updateApplicationStatus(
    applicationId: string,
    payload: UpdateApplicationStatusRequest
  ): Promise<ResponseEntity<null>> {
    const res = await api.post<ResponseEntity<null>>(
      `hr/applications/${applicationId}/status`,
      payload
    );
    return res.data;
  },
};

export function useHrRecruitmentJobsQuery(params: HrRecruitmentJobsParams) {
  return useQuery<ResponseEntity<PageResult<HrRecruitmentJobItem>>, ApiError>({
    queryKey: hrRecruitmentQueryKeys.jobs(params),
    queryFn: () => hrRecruitmentApi.getJobs(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHrRecruitmentCandidatesQuery(
  params: HrRecruitmentCandidatesParams,
  enabled = true
) {
  return useQuery<
    ResponseEntity<PageResult<HrRecruitmentCandidate>>,
    ApiError
  >({
    queryKey: hrRecruitmentQueryKeys.candidates(params),
    queryFn: () => hrRecruitmentApi.getCandidates(params),
    enabled: enabled && Boolean(params.jobId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHrRecruitmentApplicationDetailQuery(
  applicationId: string,
  enabled = true
) {
  return useQuery<ResponseEntity<HrRecruitmentApplicationDetail>, ApiError>({
    queryKey: hrRecruitmentQueryKeys.applicationDetail(applicationId),
    queryFn: () => hrRecruitmentApi.getApplicationDetail(applicationId),
    enabled: enabled && Boolean(applicationId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateApplicationStatusMutation() {
  return useMutation<
    ResponseEntity<null>,
    ApiError,
    UpdateApplicationStatusVariables
  >({
    mutationFn: ({ applicationId, payload }) =>
      hrRecruitmentApi.updateApplicationStatus(applicationId, payload),
  });
}
