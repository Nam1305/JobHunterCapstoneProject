"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  BriefcaseIcon,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, getImageUrl } from "@/lib/utils"
import type { JobCard } from "@/types/job"
import type { JobsResult } from "@/types/jobs"

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "start-ellipsis", currentPage, "end-ellipsis", totalPages]
}

function CompanyMark({
  image,
  name,
}: {
  image: string | null
  name: string
}) {
  const imageUrl = getImageUrl(image)

  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-sm font-semibold text-muted-foreground">
      {imageUrl ? (
        <span
          aria-label={`${name} logo`}
          className="size-full bg-contain bg-center bg-no-repeat"
          role="img"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      ) : (
        getCompanyMark(name)
      )}
    </div>
  )
}

function getCompanyMark(name: string | null | undefined) {
  return (name ?? "CO")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function shortLocation(location: string | null | undefined) {
  if (!location) return "Chưa cập nhật"

  return location.includes(",") ? `${location.split(",")[0]}...` : location
}

function formatDaysUntil(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật hạn"

  const diff = new Date(expiredAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return days === 0 ? "Hết hạn hôm nay" : `Còn ${days} ngày`
}

function JobListCard({
  job,
  selected,
  onSelect,
}: {
  job: JobCard
  selected: boolean
  onSelect: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "w-full cursor-pointer rounded-lg border bg-background p-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "border-primary bg-muted/40"
      )}
    >
      <div className="flex gap-3">
        <CompanyMark image={job.companyImage} name={job.companyName} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">
            {job.title ?? "Chưa cập nhật tiêu đề"}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {job.companyName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs">
            <BriefcaseIcon className="size-3.5 shrink-0" />
            {job.salaryRange ?? "Thương lượng"}
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{shortLocation(job.city)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="size-3" />
              {job.workType ?? "Chưa cập nhật"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDaysUntil(job.expiredAt)}</span>
      </div>
    </article>
  )
}

export function JobCardList({
  result,
  selectedSlug,
}: {
  result: JobsResult
  selectedSlug: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const jobs = result.items
  const totalPages = Math.max(1, result.totalPage)
  const currentPage = Math.min(result.page, totalPages)
  const pageStart = (result.page - 1) * result.pageSize
  const paginationItems = getPaginationItems(currentPage, totalPages)

  const replaceQuery = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())

    update(params)

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  const goToPage = (nextPage: number) => {
    const normalizedPage = Math.min(Math.max(1, nextPage), totalPages)

    replaceQuery((params) => {
      params.set("page", String(normalizedPage))
      params.delete("jobSlug")
    })
  }

  const selectJob = (slug: string) => {
    replaceQuery((params) => {
      params.set("jobSlug", slug)
    })
  }

  return (
    <aside className="border-r">
      <div className="flex flex-col gap-2.5 py-3 pr-3">
        {jobs.map((job) => (
          <JobListCard
            key={job.id}
            job={job}
            selected={selectedSlug === job.slug}
            onSelect={() => selectJob(job.slug)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>
          {jobs.length > 0
            ? `${pageStart + 1}-${Math.min(
                pageStart + result.pageSize,
                result.totalCount
              )} / ${result.totalCount}`
            : "0 / 0"}
        </span>
        <div className="flex max-w-full items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Trang trước"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft />
          </Button>
          {paginationItems.map((item) =>
            typeof item === "number" ? (
              <Button
                key={item}
                type="button"
                variant={currentPage === item ? "default" : "ghost"}
                size="icon-sm"
                aria-current={currentPage === item ? "page" : undefined}
                onClick={() => goToPage(item)}
              >
                {item}
              </Button>
            ) : (
              <span
                key={item}
                className="flex size-8 items-center justify-center text-sm text-muted-foreground"
              >
                ...
              </span>
            )
          )}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Trang sau"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </aside>
  )
}
