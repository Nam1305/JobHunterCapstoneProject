import {
  Building2,
  Clock,
  Globe,
  MapPin,
  Plus,
  Users,
  WalletCards,
} from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import { getCompanyBySlug } from "@/data/companies"
import { getJobs, type JobsListQuery } from "@/data/jobs"
import { getImageUrl } from "@/lib/utils"
import type { Company } from "@/types/company"
import type { JobCard } from "@/types/job"

import { TeamPhotoGallery } from "./team-photo-gallery"

function getEmptyJobsQuery(): JobsListQuery {
  return {
    search: "",
    location: "",
    companySlug: "",
    categorySlugs: [],
    subcategorySlugs: [],
    levelSlugs: [],
    workTypes: [],
    page: 1,
  }
}

async function getCompanyJobs(companySlug: string) {
  const result = await getJobs({
    ...getEmptyJobsQuery(),
    companySlug,
  })

  return result.items
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

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <UserContainer className="py-6">
      <main className="space-y-5">
        <Suspense fallback={<CompanyDetailsSkeleton />}>
          <CompanyDetailsSection slug={slug} />
        </Suspense>

        <Suspense fallback={<CompanyJobsSkeleton />}>
          <CompanyJobsSection companySlug={slug} />
        </Suspense>
      </main>
    </UserContainer>
  )
}

async function CompanyDetailsSection({ slug }: { slug: string }) {
  const company = await getCompanyBySlug(slug)

  if (!company) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Không tìm thấy công ty.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <CompanyHero company={company} />

      <InfoSection title="Tổng quan công ty">
        <HtmlContent html={company.overview ?? "Chưa cập nhật tổng quan."} />
        <Button className="mt-2 px-0" size="sm" variant="ghost">
          see more
        </Button>
      </InfoSection>

      <InfoSection title="Chế độ đãi ngộ">
        <HtmlContent html={company.benefits ?? "Chưa cập nhật chế độ đãi ngộ."} />
      </InfoSection>

      <InfoSection title="Đội ngũ của chúng tôi">
        <TeamPhotoGallery photos={company.teamPhotoUrls} />
      </InfoSection>
    </>
  )
}

async function CompanyJobsSection({ companySlug }: { companySlug: string }) {
  const jobs = await getCompanyJobs(companySlug)

  return (
    <InfoSection title="Việc làm đang tuyển dụng">
      {jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <CompanyJobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Công ty hiện chưa có việc làm đang tuyển dụng.
        </p>
      )}
    </InfoSection>
  )
}

function CompanyHero({ company }: { company: Company }) {
  return (
    <Card className="gap-0 py-0">
      <div className="flex h-56 items-center justify-center rounded-t-2xl border-b bg-muted text-sm text-muted-foreground">
        {company.coverPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${company.name} cover`}
            className="h-full w-full rounded-t-2xl object-cover"
            src={company.coverPhotoUrl}
          />
        ) : (
          "Cover photo"
        )}
      </div>

      <CardContent className="space-y-5 pb-6 pt-0">
        <div className="-mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border bg-card text-xs text-muted-foreground shadow-sm">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${company.name} logo`}
                className="h-full w-full object-contain"
                src={company.logoUrl}
              />
            ) : (
              "LOGO"
            )}
          </div>
          <Button variant="outline">
            <Plus />
            Theo dõi
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">
            {company.name}
          </h1>
          {company.companyBranches.length === 0
            ? "Chưa cập nhật địa chỉ"
            : company.companyBranches.map((branch) => (
              <p
                key={branch.id}
                className="flex items-start gap-1.5 text-sm text-muted-foreground"
              >
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                {branch.address ?? "Chưa cập nhật địa chỉ"}
              </p>
            ))}
        </div>

        <Separator />

        <dl className="grid gap-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Quốc gia</dt>
            <dd className="mt-2">🇻🇳 {company.country ?? "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngành nghề</dt>
            <dd className="mt-2">{company.companyType ?? "Chưa cập nhật"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Quy mô công ty</dt>
            <dd className="mt-2">{company.teamSize ?? "Chưa cập nhật"}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a
            className="inline-flex items-center gap-2"
            href={company.websiteUrl ?? "#"}
          >
            <Globe className="size-4" />
            Website công ty
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

function CompanyDetailsSkeleton() {
  return (
    <>
      <Card className="gap-0 py-0">
        <div className="h-56 rounded-t-2xl border-b bg-muted" />
        <CardContent className="space-y-5 pb-6 pt-0">
          <div className="-mt-3 flex items-end justify-between">
            <div className="size-20 rounded-lg border bg-muted" />
            <div className="h-9 w-24 rounded-md bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-48 rounded-md bg-muted" />
            <div className="h-4 w-full max-w-xl rounded-md bg-muted" />
            <div className="h-4 w-full max-w-md rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>

      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardContent>
            <div className="h-6 w-44 rounded-md bg-muted" />
            <Separator className="my-5" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-5/6 rounded-md bg-muted" />
              <div className="h-4 w-2/3 rounded-md bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function CompanyJobsSkeleton() {
  return (
    <InfoSection title="Việc làm đang tuyển dụng">
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-4 rounded-xl border p-4">
            <div className="grid grid-cols-[2.5rem_1fr_auto] gap-3">
              <div className="size-10 rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="h-3 w-28 rounded-md bg-muted" />
              </div>
              <div className="size-8 rounded-md bg-muted" />
            </div>
            <div className="h-4 w-36 rounded-md bg-muted" />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="h-3 w-24 rounded-md bg-muted" />
              <div className="h-3 w-28 rounded-md bg-muted" />
              <div className="h-3 w-20 rounded-md bg-muted" />
              <div className="h-3 w-32 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </InfoSection>
  )
}

function InfoSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
        <Separator className="my-5" />
        {children}
      </CardContent>
    </Card>
  )
}

function HtmlContent({ html }: { html: string }) {
  return (
    <div
      className={[
        "space-y-3 text-sm leading-7",
        "text-foreground [&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_li]:pl-1 [&_li::marker]:text-muted-foreground",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function CompanyJobCard({
  job,
}: {
  job: JobCard
}) {
  const levels = job.jobLevels.join(", ")
  const companyImage = getImageUrl(job.companyImage)

  return (
    <article className="rounded-xl border p-4">
      <div className="grid grid-cols-[2.5rem_1fr] gap-3">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted text-xs text-muted-foreground">
          {companyImage ? (
            <span
              aria-label={`${job.companyName} logo`}
              className="size-full bg-contain bg-center bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url("${companyImage}")` }}
            />
          ) : (
            getCompanyMark(job.companyName)
          )}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5">
            <Link
              className="hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              href={`/cong-viec/${job.slug ?? job.id}`}
            >
              {job.title ?? "Chưa cập nhật tiêu đề"}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {job.companyName}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <WalletCards className="size-3.5 shrink-0" />
        {job.salaryRange ?? "Thương lượng"}
      </p>

      <div className="mt-3 grid gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {job.city}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5 shrink-0" />
          {levels || "Chưa cập nhật cấp bậc"}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          {job.workType ?? "Chưa cập nhật"}
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="size-3.5 shrink-0" />
          {job.experienceRequirement ?? "Chưa cập nhật kinh nghiệm"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-5 items-center rounded-4xl border bg-background px-2 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
