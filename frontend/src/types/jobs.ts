import type { JobDetails } from "@/types/job"

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
