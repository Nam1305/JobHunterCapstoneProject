export interface JobPosting {
  id: string;
  title: string;
  createdAt: string;
  expiredAt: string;
  updatedAt: string;
  status: "Open" | "Closed";
  applicationCount: number;
}

export interface JobPostDetail {
  name: string;
  salaryRange: string;
  jobWorkType: string;
  experiedDate: string;
  category: string;
  subCategory: string;
  branch: string;
  experienceLevels: string[];
  experienceReuirement: string;
  tags: string;
  reponsibilities: string;
  requirements: string;
  benefits: string;
}

export type UpdateJobPostRequest = JobPostDetail;

export interface JobPostingOption {
  id: string;
  name: string;
}

export interface JobPostingCategory extends JobPostingOption {
  subcategories: JobPostingOption[];
}
