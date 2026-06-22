export interface Resume {
  id: string;
  fileName: string | null;
  fileUrl: string | null;
  createdDate: string | null;
  isLookingForJob: boolean;
}

export interface UpdateResumeStatusRequest {
  isLookingForJob: boolean;
}

export interface ApplyJobRequest {
  resumeId: string;
  jobId: string;
  email: string;
  name: string;
  phone: string;
  coverLetter?: string | null;
}

export interface ApplicationResult {
  id: string;
  jobId: string;
  resumeId: string | null;
  email: string;
  name: string;
  phone: string;
  coverLetter: string | null;
  status: string | null;
  appliedAt: string | null;
}

export interface JobApplicationStatus {
  status: string;
  cvAppliedUrl: string;
  fileName: string | null;
  appliedAt: string | null;
}
