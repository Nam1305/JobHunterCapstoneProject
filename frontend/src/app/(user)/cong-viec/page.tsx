import { Suspense } from "react"

import { JobCardList } from "./job-card-list"
import { JobsSearch } from "./jobs-search"
import { SelectedJobDetail } from "./selected-job-detail"
import {
  JobCardListSkeleton,
  JobsSearchSkeleton,
  SelectedJobDetailSkeleton,
} from "@/components/skeleton/jobs-page-skeletons"
import { UserContainer } from "@/components/user/user-container"
import type { ResponseEntity } from "@/types/base"
import type { JobDetails } from "@/types/job"
import type {
  JobFilterOptions,
  JobsResult,
  JobsSearchState,
} from "@/types/jobs"

const API_BASE_URL = "http://localhost:5000"
const PAGE_SIZE = 10

const emptyFilterOptions: JobFilterOptions = {
  categories: [],
  levels: [],
  workTypes: [],
  locations: [],
}

const emptyJobsResult: JobsResult = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  totalCount: 0,
  totalPage: 1,
}

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

type JobsQueryState = JobsSearchState & {
  companySlug: string
  page: number
  jobSlug: string
}

type JobsListQueryState = Omit<JobsQueryState, "jobSlug">

function getStringParam(
  searchParams: RawSearchParams,
  key: string,
  fallback = ""
) {
  const value = searchParams[key]

  if (Array.isArray(value)) return value[0] ?? fallback

  return value ?? fallback
}

function getStringArrayParam(searchParams: RawSearchParams, key: string) {
  const value = searchParams[key]
  const values = Array.isArray(value) ? value : value ? [value] : []

  return values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean)
}

function getPageParam(searchParams: RawSearchParams) {
  const page = Number(getStringParam(searchParams, "page", "1"))

  return Number.isInteger(page) && page > 0 ? page : 1
}

function parseJobsQuery(searchParams: RawSearchParams): JobsQueryState {
  return {
    search: getStringParam(searchParams, "search"),
    location: getStringParam(searchParams, "location"),
    companySlug: getStringParam(searchParams, "companySlug"),
    categorySlugs: getStringArrayParam(searchParams, "categorySlugs"),
    subcategorySlugs: getStringArrayParam(searchParams, "subcategorySlugs"),
    levelSlugs: getStringArrayParam(searchParams, "levelSlugs"),
    workTypes: getStringArrayParam(searchParams, "workTypes"),
    page: getPageParam(searchParams),
    jobSlug: getStringParam(searchParams, "jobSlug"),
  }
}

function getListQuery(query: JobsQueryState): JobsListQueryState {
  return {
    search: query.search,
    location: query.location,
    companySlug: query.companySlug,
    categorySlugs: query.categorySlugs,
    subcategorySlugs: query.subcategorySlugs,
    levelSlugs: query.levelSlugs,
    workTypes: query.workTypes,
    page: query.page,
  }
}

function getListKey(query: JobsListQueryState) {
  return JSON.stringify(query)
}

function getSearchKey(query: JobsQueryState) {
  return JSON.stringify({
    search: query.search,
    location: query.location,
    categorySlugs: query.categorySlugs,
    subcategorySlugs: query.subcategorySlugs,
    levelSlugs: query.levelSlugs,
    workTypes: query.workTypes,
  })
}

function appendParams(url: URL, key: string, values: string[]) {
  values.forEach((value) => {
    url.searchParams.append(key, value)
  })
}

async function getJobFilterOptions(): Promise<JobFilterOptions> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs/filter-options`, {
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

async function JobsSearchSection({
  query,
}: {
  query: JobsQueryState
}) {
  const filterOptions = await getJobFilterOptions()

  return (
    <JobsSearch
      key={`search-${getSearchKey(query)}`}
      filterOptions={filterOptions}
      initialState={query}
    />
  )
}

async function getJobs(query: JobsListQueryState): Promise<JobsResult> {
  try {
    const url = new URL(`${API_BASE_URL}/api/jobs`)

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
    url.searchParams.set("pageSize", String(PAGE_SIZE))

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      return emptyJobsResult
    }

    const payload = (await response.json()) as ResponseEntity<JobsResult>

    return payload.success && payload.data ? payload.data : emptyJobsResult
  } catch {
    return emptyJobsResult
  }
}

async function JobsBrowserSection({
  query,
  jobSlug,
}: {
  query: JobsListQueryState
  jobSlug: string
}) {
  const jobsResult = await getJobs(query)
  const selectedSlug = jobSlug || jobsResult.items[0]?.slug || ""

  return (
    <>
      <JobCardList result={jobsResult} selectedSlug={selectedSlug} />
      <Suspense
        key={`detail-${getListKey(query)}-${selectedSlug || "empty"}`}
        fallback={<SelectedJobDetailSkeleton />}
      >
        <SelectedJobDetailSection jobSlug={selectedSlug} />
      </Suspense>
    </>
  )
}

async function getJobBySlug(slug: string): Promise<JobDetails | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/jobs/${encodeURIComponent(slug)}`,
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

async function SelectedJobDetailSection({
  jobSlug,
}: {
  jobSlug: string
}) {
  const selectedJob = jobSlug ? await getJobBySlug(jobSlug) : null

  return <SelectedJobDetail job={selectedJob} />
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const query = parseJobsQuery(await searchParams)
  const listQuery = getListQuery(query)
  const listKey = getListKey(listQuery)

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background">
      <Suspense fallback={<JobsSearchSkeleton />}>
        <JobsSearchSection query={query} />
      </Suspense>
      <UserContainer as="section" className="grid lg:grid-cols-[24rem_1fr]">
        <Suspense key={`list-${listKey}`} fallback={<JobCardListSkeleton />}>
          <JobsBrowserSection query={listQuery} jobSlug={query.jobSlug} />
        </Suspense>
      </UserContainer>
    </div>
  )
}
