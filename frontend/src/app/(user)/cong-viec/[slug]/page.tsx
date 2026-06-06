import {
  BarChart3,
  BriefcaseBusiness,
  BriefcaseIcon,
  ClipboardCheck,
  Code2,
  ExternalLink,
  Gift,
  Heart,
  MapPin,
  Send,
  Sparkles,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import { getImageUrl } from "@/lib/utils"
import type { PageResult, ResponseEntity } from "@/types/base"
import type { CompanyCard as CompanyCardData } from "@/types/company"
import type { JobCard, JobDetails } from "@/types/job"
import type { JobsResult } from "@/types/jobs"

const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

async function getJobBySlug(slug: string): Promise<JobDetails | null> {
  if (!API_BASE_URL) return null

  try {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) return null

    const payload = (await response.json()) as ResponseEntity<JobDetails>

    return payload.success ? payload.data : null
  } catch {
    return null
  }
}

async function getCompanyForJob(
  job: JobDetails
): Promise<CompanyCardData | null> {
  if (!API_BASE_URL) return null

  const params = new URLSearchParams({
    search: job.companyName,
    page: "1",
    pageSize: "5",
  })

  try {
    const response = await fetch(`${API_BASE_URL}/companies?${params}`, {
      cache: "no-store",
    })

    if (!response.ok) return null

    const payload = (await response.json()) as ResponseEntity<
      PageResult<CompanyCardData>
    >
    const companies = payload.success && payload.data ? payload.data.items : []

    return (
      companies.find((company) => company.id === job.companyId) ??
      companies[0] ??
      null
    )
  } catch {
    return null
  }
}

async function getJobs(params: URLSearchParams): Promise<JobDetails[]> {
  if (!API_BASE_URL) return []

  try {
    const response = await fetch(`${API_BASE_URL}/jobs?${params}`, {
      cache: "no-store",
    })

    if (!response.ok) return []

    const payload = (await response.json()) as ResponseEntity<JobsResult>

    return payload.success && payload.data ? payload.data.items : []
  } catch {
    return []
  }
}

async function getCompanyJobs({
  companySlug,
  currentJobSlug,
}: {
  companySlug: string | null | undefined
  currentJobSlug: string
}): Promise<JobCard[]> {
  if (!companySlug) return []

  const params = new URLSearchParams({
    companySlug,
    page: "1",
    pageSize: "4",
  })
  const jobs = await getJobs(params)

  return jobs.filter((job) => job.slug !== currentJobSlug).slice(0, 3)
}

async function getSimilarJobs(job: JobDetails): Promise<JobCard[]> {
  if (!job.subcategorySlug) return []

  const params = new URLSearchParams({
    page: "1",
    pageSize: "6",
  })
  params.append("subcategorySlugs", job.subcategorySlug)

  const jobs = await getJobs(params)

  return jobs.filter((similarJob) => similarJob.slug !== job.slug).slice(0, 5)
}

function getJobSections(job: JobDetails) {
  return [
    {
      title: "TRÁCH NHIỆM",
      icon: Sparkles,
      content: job.responsibilities,
    },
    {
      title: "YÊU CẦU",
      icon: ClipboardCheck,
      content: job.requirements,
    },
    {
      title: "PHÚC LỢI",
      icon: Gift,
      content: job.benefits,
    },
  ].filter(
    (
      section
    ): section is {
      title: string
      icon: typeof Sparkles
      content: string
    } => Boolean(section.content)
  )
}

function HtmlContent({ html }: { html: string }) {
  return (
    <div
      className={[
        "space-y-3 text-sm leading-7 text-muted-foreground",
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:pl-1 [&_li::marker]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function formatDaysUntil(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật hạn"

  const diff = new Date(expiredAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return days === 0 ? "Hết hạn hôm nay" : `Còn ${days} ngày`
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

function CompanyLogo({
  image,
  name,
  sizeClassName,
}: {
  image: string | null
  name: string
  sizeClassName: string
}) {
  const logoUrl = getImageUrl(image)

  return (
    <div
      className={`${sizeClassName} flex items-center justify-center overflow-hidden rounded-md border bg-muted text-xs text-muted-foreground`}
    >
      {logoUrl ? (
        <span
          aria-label={`${name} logo`}
          className="size-full bg-contain bg-center bg-no-repeat"
          role="img"
          style={{ backgroundImage: `url("${logoUrl}")` }}
        />
      ) : (
        getCompanyMark(name)
      )}
    </div>
  )
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = await getJobBySlug(slug)

  if (!job) {
    return (
      <UserContainer className="py-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Không tìm thấy công việc.
          </CardContent>
        </Card>
      </UserContainer>
    )
  }

  const company = await getCompanyForJob(job)
  const [companyJobs, similarJobs] = await Promise.all([
    getCompanyJobs({
      companySlug: company?.slug,
      currentJobSlug: job.slug,
    }),
    getSimilarJobs(job),
  ])
  const jobSections = getJobSections(job)

  return (
    <UserContainer className="py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18.25rem] lg:items-start">
        <main className="space-y-5">
          <Card>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-normal">
                  {job.title ?? "Chưa cập nhật tiêu đề"}
                </h1>
                {/* was text-lg font-semibold — way too heavy, salary is secondary info */}
                <p className="flex items-center gap-2 text-base text-muted-foreground">
                  <WalletCards className="size-4 shrink-0" />
                  <span className="font-medium text-foreground">
                    {job.salaryRange ?? "Thương lượng"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  {job.city || "Chưa cập nhật địa điểm"}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 shrink-0" />
                  {job.jobLevels.join(", ") || "Chưa cập nhật cấp bậc"}
                </span>
                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness className="size-3.5 shrink-0" />
                  {job.experienceRequirement ?? "Chưa cập nhật kinh nghiệm"}
                </span>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                {formatDaysUntil(job.expiredAt)}
                <span className="px-2" aria-hidden="true">
                  •
                </span>
                {job.applicants} ứng viên
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button size="lg">
                  <Send />
                  Ứng tuyển ngay
                </Button>
                <Button size="lg" variant="outline">
                  <Heart />
                  Lưu công việc
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6">
              {jobSections.length > 0 ? (
                jobSections.map((section, index) => (
                  <section key={section.title} className="space-y-3">
                    {index > 0 ? <Separator /> : null}
                    {/* was font-semibold tracking-wide — too heavy on all-caps Vietnamese */}
                    <div className="flex items-center gap-2 pt-1">
                      <section.icon className="size-3.5 text-muted-foreground" />
                      <h2 className="text-xs font-medium tracking-widest text-muted-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <HtmlContent html={section.content} />
                  </section>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa cập nhật mô tả công việc.
                </p>
              )}

              <section className="space-y-3">
                <Separator />
                <div className="flex items-center gap-2 pt-1">
                  <Code2 className="size-3.5 text-muted-foreground" />
                  <h2 className="text-xs font-medium tracking-widest text-muted-foreground">
                    KỸ NĂNG YÊU CẦU
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.length > 0 ? (
                    job.tags.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa cập nhật kỹ năng.
                    </p>
                  )}
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Việc làm tương tự</h2>

              <div className="mt-4 space-y-3">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => (
                    <SimilarJobRow key={similarJob.id} job={similarJob} />
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                    Chưa có việc làm tương tự.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <CompanyCard company={company} job={job} />
          <CompanyJobsCard companySlug={company?.slug} jobs={companyJobs} />
        </aside>
      </div>
    </UserContainer>
  )
}

function CompanyCard({
  company,
  job,
}: {
  company: CompanyCardData | null
  job: JobDetails
}) {
  const companyName = company?.name ?? job.companyName
  const coverPhotoUrl = getImageUrl(company?.coverPhotoUrl)
  const logoUrl = getImageUrl(company?.logoUrl ?? job.companyImage)

  return (
    <Card className="gap-0 py-0">
      <div className="relative h-18 border-b bg-muted">
        {coverPhotoUrl ? (
          <span
            aria-label={`${companyName} cover`}
            className="absolute inset-0 bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url("${coverPhotoUrl}")` }}
          />
        ) : (
          <BriefcaseIcon className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
        )}
        <div className="absolute -bottom-5 left-4 flex size-10 items-center justify-center rounded-md border bg-card text-xs font-semibold">
          {logoUrl ? (
            <span
              aria-label={`${companyName} logo`}
              className="size-full bg-contain bg-center bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url("${logoUrl}")` }}
            />
          ) : (
            getCompanyMark(companyName)
          )}
        </div>
      </div>

      <CardContent className="px-4 pt-7 pb-3">
        <h2 className="text-sm leading-5 font-semibold">{companyName}</h2>

        <dl className="mt-3 text-xs">
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Ngành nghề</dt>
            {/* dropped font-medium — text-xs doesn't need it */}
            <dd>{company?.companyType ?? "Chưa cập nhật"}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quy mô</dt>
            <dd>{company?.teamSize ?? "Chưa cập nhật"}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quốc gia</dt>
            <dd>{company?.country ?? "Chưa cập nhật"}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Theo dõi</dt>
            <dd>{company?.numberOfFollowers ?? 0} người</dd>
          </div>
        </dl>
      </CardContent>

      <Separator />

      <div className="flex items-center px-4 py-2.5 text-xs text-muted-foreground">
        <BriefcaseIcon className="mr-1.5 size-3.5 shrink-0" />
        <span>
          <span className="font-semibold text-foreground">
            {company?.openingVacancies ?? 0}
          </span>
          {" việc làm đang tuyển"}
        </span>
      </div>

      <Separator />

      <div className="px-4 py-2 text-center">
        {company?.slug ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/cong-ty/${company.slug}`}>
              Xem công ty
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        ) : (
          <Button disabled variant="ghost" size="sm">
            Xem công ty
            <ExternalLink className="size-3.5" />
          </Button>
        )}
      </div>
    </Card>
  )
}

function CompanyJobsCard({
  companySlug,
  jobs,
}: {
  companySlug: string | null | undefined
  jobs: JobCard[]
}) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold">
          {jobs.length} việc làm cùng công ty
        </h2>

        {jobs.length > 0 ? (
          <>
            <div className="mt-4 space-y-4">
              {jobs.map((job, index) => (
                <div key={job.id}>
                  <div className="grid grid-cols-[2rem_1fr_auto] gap-3">
                    <CompanyLogo
                      image={job.companyImage}
                      name={job.companyName}
                      sizeClassName="size-8"
                    />

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm leading-5 font-medium">
                        <Link href={`/cong-viec/${job.slug}`}>
                          {job.title ?? "Chưa cập nhật tiêu đề"}
                        </Link>
                      </h3>
                      {/* dropped font-medium — salary at text-xs is fine plain */}
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <WalletCards className="size-3 shrink-0" />
                        {job.salaryRange ?? "Thương lượng"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      aria-label="Lưu công việc"
                      size="icon-xs"
                      variant="ghost"
                    >
                      <Heart />
                    </Button>
                  </div>
                  {index < jobs.length - 1 ? (
                    <Separator className="mt-4" />
                  ) : null}
                </div>
              ))}
            </div>

            {companySlug ? (
              <Button asChild className="mt-4 w-full" variant="ghost" size="sm">
                <Link href={`/cong-viec?companySlug=${companySlug}`}>
                  Xem thêm việc làm
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            ) : null}
          </>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Chưa có việc làm khác cùng công ty.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function SimilarJobRow({ job }: { job: JobCard }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="grid gap-4 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
        <CompanyLogo
          image={job.companyImage}
          name={job.companyName}
          sizeClassName="size-12"
        />

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3 sm:block">
            <div>
              <h3 className="leading-5 font-medium">
                <Link href={`/cong-viec/${job.slug}`}>
                  {job.title ?? "Chưa cập nhật tiêu đề"}
                </Link>
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {job.companyName}
              </p>
            </div>
            <Button
              aria-label="Lưu công việc"
              className="sm:hidden"
              size="icon-sm"
              variant="ghost"
            >
              <Heart />
            </Button>
          </div>

          {/* was font-medium text-sm — salary is secondary, muted is enough */}
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <WalletCards className="size-3.5 shrink-0" />
            {job.salaryRange ?? "Thương lượng"}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <Button aria-label="Lưu công việc" size="icon-sm" variant="ghost">
            <Heart />
          </Button>
          <Button size="sm">Ứng tuyển</Button>
        </div>

        <Button className="w-full sm:hidden" size="sm">
          Ứng tuyển
        </Button>
      </div>
    </div>
  )
}
