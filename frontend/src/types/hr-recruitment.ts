export enum ApplicationStatus {
  Pending = "Pending",
  Rejected = "Rejected",
  Accepted = "Accepted",
}

export interface HrRecruitmentJobsParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface HrRecruitmentCandidatesParams {
  jobId: string;
  status?: ApplicationStatus;
  page?: number;
  pageSize?: number;
}

export interface HrRecruitmentJobItem {
  id: string;
  title: string | null;
  slug: string | null;
  applicationCount: number;
}

export interface HrRecruitmentCandidate {
  applicationId: string;
  candidateId: string;
  candidateName: string | null;
  email: string | null;
  phone: string | null;
  resumeUrl: string | null;
  appliedAt: string | null;
  status: ApplicationStatus | null;
  matchScore: number | null;
}

export interface HrRecruitmentApplicationDetail {
  applicationId: string;
  candidateName: string | null;
  phone: string | null;
  email: string | null;
  matchScore: number | null;
  aiSuggestion: string | null;
  coverLetter: string | null;
  status: ApplicationStatus | null;
  fileUrl: string | null;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}
