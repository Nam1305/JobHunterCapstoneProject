import {
  BriefcaseBusiness,
  BriefcaseIcon,
  ClipboardCheck,
  Code2,
  ExternalLink,
  Gift,
  GraduationCap,
  MapPin,
  Send,
  Sparkles,
  WalletCards,
} from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { ApplyJobButton } from "@/components/application/apply-job-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import { getCompanies } from "@/data/companies"
import { getJobBySlug, getJobSuggestions } from "@/data/jobs"
import { getImageUrl } from "@/lib/utils"
import type { CompanyCard as CompanyCardData } from "@/types/company"
import type { JobCard, JobDetails } from "@/types/job"
import { getCompanyMark } from "@/utils/company"
import { getDisplayJobTags } from "@/utils/job-tags"
import { formatDaysUntil } from "@/utils/jobs"
import { SaveJobButton } from "./_components/save-job-button"

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
 *                   └─ GeneralInfoCard
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

async function getSimilarJobs(job: JobDetails): Promise<JobCard[]> {
  return getJobSuggestions(job.id, 5)
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

function formatDeadlineDate(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật"

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(expiredAt))
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

// Fetches company context and renders the right sidebar cards.
async function CompanySection({ job }: { job: JobDetails }) {
  const company = await getCompanyForJob(job)

  return (
    <>
      <CompanyCard company={company} job={job} />
      <GeneralInfoCard job={job} />
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

        <Separator />

        <div className="text-muted-foreground">
          Hạn nộp hồ sơ:{" "}
          <span className="font-semibold text-foreground">
            {formatDeadlineDate(job.expiredAt)}
          </span>{" "}
          ({formatDaysUntil(job.expiredAt)})
        </div>

        <div className="grid grid-cols-[7fr_3fr] gap-3">
          <ApplyJobButton
            size="lg"
            job={{
              id: job.id,
              title: job.title ?? "Chưa cập nhật tiêu đề",
              companyName: job.companyName,
            }}
          >
            <Send />
            Ứng tuyển ngay
          </ApplyJobButton>
          <SaveJobButton jobId={job.id} size="lg" />
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

function GeneralInfoCard({ job }: { job: JobDetails }) {
  const generalInfoItems = [
    {
      label: "Kinh nghiệm",
      value: job.experienceRequirement ?? "Chưa cập nhật",
      icon: BriefcaseBusiness,
    },
    {
      label: "Trình độ",
      value: job.jobLevels.join(", ") || "Chưa cập nhật",
      icon: GraduationCap,
    },
    {
      label: "Địa điểm",
      value: job.city || "Chưa cập nhật",
      icon: MapPin,
    },
    {
      label: "Hình thức làm việc",
      value: job.workType ?? "Chưa cập nhật",
      icon: BriefcaseIcon,
    },
  ]

  return (
    <Card>
      <CardContent className="space-y-5">
        <h2 className="text-lg font-semibold">Thông tin chung</h2>

        <div className="space-y-5">
          {generalInfoItems.map((item) => (
            <div key={item.label} className="grid grid-cols-[2.75rem_1fr] gap-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <item.icon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-sm leading-5 font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
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
          <h3 className="leading-5 font-medium">
            <Link href={`/cong-viec/${job.slug}`}>
              {job.title ?? "Chưa cập nhật tiêu đề"}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {job.companyName}
          </p>

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

        <div className="hidden sm:block">
          <ApplyJobButton
            size="sm"
            job={{
              id: job.id,
              title: job.title ?? "Chưa cập nhật tiêu đề",
              companyName: job.companyName,
            }}
          />
        </div>

        <ApplyJobButton
          className="w-full sm:hidden"
          size="sm"
          job={{
            id: job.id,
            title: job.title ?? "Chưa cập nhật tiêu đề",
            companyName: job.companyName,
          }}
        />
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
