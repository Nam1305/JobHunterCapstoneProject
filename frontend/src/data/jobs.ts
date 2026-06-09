import "server-only";
import type { PageResult, ResponseEntity } from "@/types/base";
import type {
  JobCard,
  JobDetails,
  JobFilterOptions,
  JobsSearchState,
} from "@/types/job";

const API_BASE_URL = process.env.API_BASE_URL
const PAGE_SIZE = 10

const emptyFilterOptions: JobFilterOptions = {
  categories: [],
  levels: [],
  workTypes: [],
  locations: [],
}

const emptyJobsResult: PageResult<JobCard> = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPage: 1,
}

export type JobsListQuery = JobsSearchState & {
  companySlug: string
  page: number
  pageSize?: number
}

function appendParams(url: URL, key: string, values: string[]) {
  values.forEach((value) => {
    url.searchParams.append(key, value)
  })
}

export async function getTopJobs(): Promise<JobCard[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/jobs/top?limit=9`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const payload = (await response.json()) as ResponseEntity<JobCard[]>

    return payload.data ?? []
  } catch {
    return []
  }
}

export async function getJobFilterOptions(): Promise<JobFilterOptions> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/filter-options`, {
      cache: "no-store",
    })


    if (!response.ok) {
      return emptyFilterOptions
    }

    const payload = (await response.json()) as ResponseEntity<JobFilterOptions>

    return payload.success && payload.data ? payload.data : emptyFilterOptions
  } catch {
    return emptyFilterOptions
  }
}

export async function getJobs(
  query: JobsListQuery
): Promise<PageResult<JobCard>> {
  try {
    const url = new URL(`${API_BASE_URL}/jobs`)
    if (query.search) url.searchParams.set("search", query.search)
    if (query.location) url.searchParams.set("location", query.location)
    if (query.companySlug) {
      url.searchParams.set("companySlug", query.companySlug)
    }

    appendParams(url, "categorySlugs", query.categorySlugs)
    appendParams(url, "subcategorySlugs", query.subcategorySlugs)
    appendParams(url, "levelSlugs", query.levelSlugs)
    appendParams(url, "workTypes", query.workTypes)
    url.searchParams.set("page", String(query.page))
    url.searchParams.set("pageSize", String(query.pageSize ?? PAGE_SIZE))

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      return emptyJobsResult
    }

    const payload = (await response.json()) as ResponseEntity<PageResult<JobCard>>

    return payload.success && payload.data ? payload.data : emptyJobsResult
  } catch {
    return emptyJobsResult
  }
}

export async function getJobBySlug(slug: string): Promise<JobDetails | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as ResponseEntity<JobDetails>

    return payload.success ? payload.data : null
  } catch {
    return null
  }
}
