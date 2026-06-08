import { Suspense } from "react"

import { JobCardList } from "./_components/job-card-list"
import { JobsSearch } from "./_components/jobs-search"
import { SelectedJobDetail } from "./_components/selected-job-detail"
import {
  JobCardListSkeleton,
  JobsSearchSkeleton,
  SelectedJobDetailSkeleton,
} from "@/app/(user)/cong-viec/_components/jobs-page-skeletons"
import { UserContainer } from "@/components/user/user-container"
import {
  getJobBySlug,
  getJobFilterOptions,
  getJobs,
  type JobsListQuery,
} from "@/data/jobs"
import type { JobsSearchState } from "@/types/job"

/*
 * Component tree
 * JobsPage
 * ├─ Suspense(JobsSearchSkeleton)
 * │  └─ JobsSearchSection
 * │     └─ JobsSearch
 * └─ UserContainer
 *    └─ Suspense(JobCardListSkeleton)
 *       └─ JobsBrowserSection
 *          ├─ JobCardList
 *          └─ Suspense(SelectedJobDetailSkeleton)
 *             └─ SelectedJobDetailSection
 *                └─ SelectedJobDetail
 */

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

type JobsQueryState = JobsSearchState & {
  companySlug: string
  page: number
  jobSlug: string
}

type JobsListQueryState = JobsListQuery

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

// Fetches filter options and renders the search/filter bar.
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

// Fetches the paged job list and coordinates list selection with the detail pane.
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

// Fetches and renders the currently selected job details.
async function SelectedJobDetailSection({
  jobSlug,
}: {
  jobSlug: string
}) {
  const selectedJob = jobSlug ? await getJobBySlug(jobSlug) : null

  return <SelectedJobDetail job={selectedJob} />
}

// Server page that parses URL filters and renders the jobs browser shell.
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
      <UserContainer
        as="section"
        className="grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[24rem_1fr] lg:items-start"
      >
        <Suspense key={`list-${listKey}`} fallback={<JobCardListSkeleton />}>
          <JobsBrowserSection query={listQuery} jobSlug={query.jobSlug} />
        </Suspense>
      </UserContainer>
    </div>
  )
}
