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
  experiedDate?: string;
  expiredDate?: string;
  category: string;
  subCategory: string;
  branch: string;
  experienceLevels: string[];
  level?: string;
  experienceReuirement?: string;
  experienceRequirement?: string;
  tags: string;
  tag?: string;
  reponsibilities?: string;
  responsibilities?: string;
  requirements: string;
  benefits: string;
}

export type UpdateJobPostRequest = JobPostDetail;

export interface JobPostingOption {
  id: string;
  name: string;
}

export type ExperienceLevel = JobPostingOption;
export type BranchOption = JobPostingOption;

export interface JobPostingCategory extends JobPostingOption {
  subcategories: JobPostingOption[];
}
