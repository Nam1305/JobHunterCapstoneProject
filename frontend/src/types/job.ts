export type JobWorkType = "Onsite" | "Remote" | "Hybrid" | "Oversea"

export type CompanyBranchResponse = {
  id: string
  companyId: string
  name: string | null
  address: string | null
  city: string | null
  citySlug: string | null
}

export interface JobCard {
  id: string
  title: string | null
  companyName: string
  companyImage: string | null
  salaryRange: string | null
  experienceRequirement: string | null
  workType: JobWorkType | null
  expiredAt: string | null
  tags: string[]
  slug: string
  city: string
  jobLevels: string[]
}

export interface JobDetails extends JobCard {
  companyId: string
  branchId: string | null
  subcategoryId: string | null
  subcategorySlug?: string | null
  applicants: number
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  branch: CompanyBranchResponse | null
}

export type SlugOption = {
  name: string
  slug: string
}

export type JobCategoryOption = SlugOption & {
  subcategories: SlugOption[]
}

export type JobFilterOptions = {
  categories: JobCategoryOption[]
  levels: SlugOption[]
  workTypes: string[]
  locations: string[]
}

export type JobsSearchState = {
  search: string
  location: string
  categorySlugs: string[]
  subcategorySlugs: string[]
  levelSlugs: string[]
  workTypes: string[]
}

export type JobsResult = {
  items: JobDetails[]
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
}
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
  experienceRequirement?: string;
  tags: string[];
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
