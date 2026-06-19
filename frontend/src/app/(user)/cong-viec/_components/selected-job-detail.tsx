import { BriefcaseIcon, Clock3, MapPin } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getImageUrl } from "@/lib/utils"
import type { JobDetails } from "@/types/job"
import { getCompanyMark, getCompanySlug } from "@/utils/company"
import { getDisplayJobTags } from "@/utils/job-tags"

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

function formatDeadline(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật"

  return new Intl.DateTimeFormat("vi-VN").format(new Date(expiredAt))
}

function getJobSections(job: JobDetails) {
  return [
    {
      title: "Mô tả công việc",
      content: job.responsibilities,
    },
    {
      title: "Yêu cầu",
      content: job.requirements,
    },
    {
      title: "Quyền lợi",
      content: job.benefits,
    },
  ]
}

export function SelectedJobDetail({ job }: { job: JobDetails | null }) {
  return (
    <main className="min-w-0 py-5 lg:sticky lg:top-16 lg:pl-7">
      {job ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <CompanyMark image={job.companyImage} name={job.companyName} />
            <div className="min-w-0 flex-1">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold sm:text-xl">
                    <Link
                      className="hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      href={`/cong-viec/${job.slug}`}
                    >
                      {job.title ?? "Chưa cập nhật tiêu đề"}
                    </Link>
                  </h1>
                  <Link
                    className="mt-0.5 inline-block text-sm text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    href={`/cong-ty/${getCompanySlug(job.companyName)}`}
                  >
                    {job.companyName}
                  </Link>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm">
                <BriefcaseIcon className="size-4" />
                {job.salaryRange ?? "Thương lượng"}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.branch?.address ?? job.city ?? "Chưa cập nhật địa điểm"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  Hạn nộp hồ sơ: {formatDeadline(job.expiredAt)}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {getDisplayJobTags(job.tags).map((tag, index) => (
                    <Badge key={`${tag.label}-${index}`} variant="outline">
                      {tag.label}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full sm:w-auto">Ứng tuyển ngay</Button>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-6">
            {getJobSections(job).map((section, index) => (
              <section key={section.title}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <h2 className="text-base font-semibold">{section.title}</h2>
                </div>
                {section.content ? (
                  <div
                    className="prose prose-sm max-w-none text-sm leading-6"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                ) : (
                  <p className="pl-7 text-sm text-muted-foreground">
                    Chưa cập nhật
                  </p>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Chọn một việc làm để xem chi tiết.
        </div>
      )}
    </main>
  )
}
