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
import { Suspense } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import { getCompanies } from "@/data/companies"
import { getJobBySlug, getJobs } from "@/data/jobs"
import { getImageUrl } from "@/lib/utils"
import type { CompanyCard as CompanyCardData } from "@/types/company"
import type { JobCard, JobDetails } from "@/types/job"
import { getCompanyMark } from "@/utils/company"
import { getDisplayJobTags } from "@/utils/job-tags"
import { formatDaysUntil, getEmptyJobsQuery } from "@/utils/jobs"

/*
 * Component tree
 * JobDetailsPage
 * └─ UserContainer
 *    └─ Suspense(JobDetailsPageSkeleton)
 *       └─ JobDetailsContent
 *          ├─ main
 *          │  ├─ JobHeaderCard
 *          │  ├─ JobDescriptionCard
 *          │  │  └─ HtmlContent
 *          │  └─ Similar jobs card
 *          │     └─ Suspense(SimilarJobsSkeleton)
 *          │        └─ SimilarJobsSection
 *          │           └─ SimilarJobRow
 *          │              └─ CompanyLogo
 *          └─ aside
 *             └─ Suspense(CompanyCardSkeleton)
 *                └─ CompanySection
 *                   ├─ CompanyCard
 *                   └─ CompanyJobsCard
 *                      └─ CompanyLogo
 */

// ─── Data fetching helpers ────────────────────────────────────────────────────

async function getCompanyForJob(
  job: JobDetails
): Promise<CompanyCardData | null> {
  const companies = await getCompanies({
    search: job.companyName,
    page: 1,
  })

  return (
    companies.items.find((company) => company.id === job.companyId) ??
    companies.items[0] ??
    null
  )
}

/**
 * 
 * Fetch up to 3 other jobs from the same company, excluding the current job. We fetch
 * a few extras and filter client-side to avoid the case where the company has very few jobs and
 * the current job is the only one that shows up in the results, which would look a bit odd.
 */
async function getCompanyJobs({
  companySlug,
  currentJobSlug,
}: {
  companySlug: string | null | undefined
  currentJobSlug: string
}): Promise<JobCard[]> {
  if (!companySlug) return []

  const result = await getJobs({
    ...getEmptyJobsQuery(),
    companySlug,
    pageSize: 4,
  })

  return result.items.filter((job) => job.slug !== currentJobSlug).slice(0, 3)
}

async function getSimilarJobs(job: JobDetails): Promise<JobCard[]> {
  if (!job.subcategorySlug) return []

  const result = await getJobs({
    ...getEmptyJobsQuery(),
    subcategorySlugs: [job.subcategorySlug],
    pageSize: 6,
  })

  return result.items
    .filter((similarJob) => similarJob.slug !== job.slug)
    .slice(0, 5)
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

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

// ─── Shared UI components ─────────────────────────────────────────────────────

// Renders trusted HTML content with page-specific typography rules.
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

// Renders a compact company logo or fallback initials mark.
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

// ─── Page entry point ─────────────────────────────────────────────────────────

// Server page entry point for a single job detail route.
export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <UserContainer className="py-6">
      <Suspense fallback={<JobDetailsPageSkeleton />}>
        <JobDetailsContent slug={slug} />
      </Suspense>
    </UserContainer>
  )
}

// ─── Layout shell ─────────────────────────────────────────────────────────────
// Awaits only the job itself. All downstream fetches are delegated to
// async section components, each behind its own Suspense boundary so they
// stream in independently without blocking one another.

// Builds the main job detail layout after the primary job has loaded.
async function JobDetailsContent({ slug }: { slug: string }) {
  const job = await getJobBySlug(slug)

  if (!job) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Không tìm thấy công việc.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18.25rem] lg:items-start">
      <main className="space-y-5">
        {/* Pure – renders immediately once job resolves */}
        <JobHeaderCard job={job} />

        {/* Pure – renders immediately once job resolves */}
        <JobDescriptionCard job={job} />

        {/* Streams in independently */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Việc làm tương tự</h2>
            <div className="mt-4 space-y-3">
              <Suspense fallback={<SimilarJobsSkeleton />}>
                <SimilarJobsSection job={job} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Sidebar streams in independently */}
      <aside className="space-y-4 lg:sticky lg:top-20">
        <Suspense fallback={<CompanyCardSkeleton />}>
          <CompanySection job={job} />
        </Suspense>
      </aside>
    </div>
  )
}

// ─── Async section components ─────────────────────────────────────────────────

// Company card + company jobs are chained (jobs depend on company.slug),
// so they share one Suspense boundary and one async component.
// Fetches company context and renders the right sidebar cards.
async function CompanySection({ job }: { job: JobDetails }) {
  const company = await getCompanyForJob(job)
  const companyJobs = await getCompanyJobs({
    companySlug: company?.slug,
    currentJobSlug: job.slug,
  })

  return (
    <>
      <CompanyCard company={company} job={job} />
      <CompanyJobsCard companySlug={company?.slug} jobs={companyJobs} />
    </>
  )
}

// Fetches and renders jobs similar to the current job.
async function SimilarJobsSection({ job }: { job: JobDetails }) {
  const similarJobs = await getSimilarJobs(job)

  if (similarJobs.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        Chưa có việc làm tương tự.
      </p>
    )
  }

  return (
    <>
      {similarJobs.map((similarJob) => (
        <SimilarJobRow key={similarJob.id} job={similarJob} />
      ))}
    </>
  )
}

// ─── Pure presentational cards ────────────────────────────────────────────────

// Renders the primary job title, metadata, deadline, and actions.
function JobHeaderCard({ job }: { job: JobDetails }) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">
            {job.title ?? "Chưa cập nhật tiêu đề"}
          </h1>
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
  )
}

// Renders responsibilities, requirements, benefits, and required skill tags.
function JobDescriptionCard({ job }: { job: JobDetails }) {
  const jobSections = getJobSections(job)

  return (
    <Card>
      <CardContent className="space-y-6">
        {jobSections.length > 0 ? (
          jobSections.map((section, index) => (
            <section key={section.title} className="space-y-3">
              {index > 0 ? <Separator /> : null}
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
              job.tags.map((skill, index) => (
                <Badge key={`${skill}-${index}`} variant="secondary">
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
  )
}

// Renders a compact company summary card for the sidebar.
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

// Renders a sidebar list of other jobs from the same company.
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
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <WalletCards className="size-3 shrink-0" />
                        {job.salaryRange ?? "Thương lượng"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {getDisplayJobTags(job.tags).map((tag, index) => (
                          <Badge
                            key={`${tag.label}-${index}`}
                            variant="outline"
                          >
                            {tag.label}
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
                <Link href={`/cong-viec`}>
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

// Renders one similar-job row inside the similar jobs card.
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

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <WalletCards className="size-3.5 shrink-0" />
            {job.salaryRange ?? "Thương lượng"}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {getDisplayJobTags(job.tags).map((tag, index) => (
              <Badge key={`${tag.label}-${index}`} variant="outline">
                {tag.label}
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

// ─── Skeletons ────────────────────────────────────────────────────────────────

// Placeholder layout while the job details page streams in.
function JobDetailsPageSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18.25rem] lg:items-start">
      <main className="space-y-5">
        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="h-8 w-full max-w-xl rounded-md bg-muted" />
              <div className="h-5 w-48 rounded-md bg-muted" />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="h-4 w-32 rounded-md bg-muted" />
              <div className="h-4 w-36 rounded-md bg-muted" />
              <div className="h-4 w-44 rounded-md bg-muted" />
            </div>
            <Separator />
            <div className="h-4 w-40 rounded-md bg-muted" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-11 rounded-md bg-muted" />
              <div className="h-11 rounded-md bg-muted" />
            </div>
          </CardContent>
        </Card>

        {[1, 2].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-4">
              <div className="h-5 w-40 rounded-md bg-muted" />
              <Separator />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="h-4 w-5/6 rounded-md bg-muted" />
                <div className="h-4 w-2/3 rounded-md bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <aside className="space-y-4">
        <CompanyCardSkeleton />
      </aside>
    </div>
  )
}

// Placeholder layout for the company sidebar Suspense boundary.
function CompanyCardSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="h-18 border-b bg-muted" />
        <CardContent className="space-y-3 px-4 pt-7 pb-3">
          <div className="h-5 w-32 rounded-md bg-muted" />
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-5/6 rounded-md bg-muted" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <div className="h-5 w-36 rounded-md bg-muted" />
          <div className="h-16 rounded-md bg-muted" />
          <div className="h-16 rounded-md bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}

// Placeholder rows for the similar jobs Suspense boundary.
function SimilarJobsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-xl border bg-muted" />
      ))}
    </div>
  )
}
