"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react"

import { useHrRecruitmentJobsQuery } from "@/api/hr-recruitment.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

const statusTabs = [
  { label: "Tất cả", value: "all" },
  { label: "Đang mở", value: "open" },
  { label: "Đã đóng", value: "closed" },
] as const

type StatusTab = (typeof statusTabs)[number]["value"]

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: unknown } } }
    ).response

    if (typeof response?.data?.message === "string") {
      return response.data.message
    }
  }

  return "Không thể tải danh sách vị trí."
}

interface CandidateManagementPanelProps {
  selectedJobId: string | null
  onSelectedJobIdChange: (jobId: string) => void
}

export default function CandidateManagementPanel({
  selectedJobId,
  onSelectedJobIdChange,
}: CandidateManagementPanelProps) {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [selectedTab, setSelectedTab] = React.useState<StatusTab>("all")
  const [page, setPage] = React.useState(1)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const querySearch = debouncedSearch.trim()

  const { data, error, isFetching, isLoading } = useHrRecruitmentJobsQuery({
    search: querySearch || undefined,
    status:
      selectedTab === "all"
        ? undefined
        : selectedTab === "open"
          ? "Active"
          : "Expired",
    page,
    pageSize: PAGE_SIZE,
  })

  const pageData = data?.data
  const jobs = pageData?.items ?? []
  const totalPage = pageData?.totalPage ?? 0
  const totalCount = pageData?.totalCount ?? 0
  const safeTotalPage = Math.max(totalPage, 1)
  const canGoPrevious = page > 1 && !isFetching
  const canGoNext = page < totalPage && !isFetching
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value)
    }, 500)
  }
  const handleTabChange = (value: string) => {
    setSelectedTab(value as StatusTab)
    setPage(1)
  }

  return (
    <section className="flex min-h-0 w-full flex-col border-r bg-background md:w-70 md:max-w-70">
      <div className="border-b bg-background px-3 py-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            className="pl-9"
            placeholder="Tìm kiếm vị trí..."
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className="gap-0"
      >
        <TabsList
          variant="line"
          className="grid h-11 w-full grid-cols-3 gap-0 border-b px-3"
        >
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-active:text-primary data-active:after:bg-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="space-y-1 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="px-3 py-3">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-muted-foreground">
            {getErrorMessage(error)}
          </div>
        ) : jobs.length ? (
          <div className="py-1">
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/70",
                  selectedJobId === job.id && "bg-muted"
                )}
                onClick={() => onSelectedJobIdChange(job.id)}
              >
                <span className="min-w-0">
                  <span className="block truncate leading-5 text-foreground">
                    {job.title ?? "Chưa đặt tên vị trí"}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <UsersIcon className="size-3.5" />
                    {job.applicationCount} ứng viên
                  </span>
                </span>
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-muted-foreground">
            Không có vị trí phù hợp.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-3 py-3">
        <div className="text-xs text-muted-foreground">
          {isFetching ? "Đang tải..." : `${totalCount} vị trí`}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() =>
              setPage((currentPage) => Math.max(1, currentPage - 1))
            }
            disabled={!canGoPrevious}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Trang trước</span>
          </Button>
          <span className="min-w-14 text-center text-xs text-muted-foreground">
            {Math.min(page, safeTotalPage)} / {safeTotalPage}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={!canGoNext}
          >
            <ChevronRightIcon />
            <span className="sr-only">Trang sau</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
