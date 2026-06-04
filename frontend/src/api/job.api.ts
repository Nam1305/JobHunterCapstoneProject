import { PageResult, ResponseEntity } from "@/types/base";
import api from "./api";
import { JobPostDetail, JobPosting } from "@/types/job";
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
        const res = await api.get<ResponseEntity<PageResult<JobPosting>>>("/jobs", {
            params,
        });
        return res.data;
    },
    async getJobPostingDetail(jobId: string) {
        const res = await api.get<ResponseEntity<JobPostDetail>>(`/jobs/${jobId}`);
        return res.data;
    }
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
    });
}