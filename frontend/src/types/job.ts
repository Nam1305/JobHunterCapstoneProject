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
  applicants: number
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  branch: CompanyBranchResponse | null
}
