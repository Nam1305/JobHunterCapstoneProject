import {
  Building2,
  Clock,
  Globe,
  Heart,
  MapPin,
  Plus,
  Users,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import type { JobCard } from "@/types/job"
import type { Company } from "@/types/company"

const companyResponse: Company = {
  id: "f3f52d35-3b68-46f5-9c62-14444ad7b3dd",
  name: "FPT IS",
  websiteUrl: "https://fpt-is.com",
  country: "Vietnam",
  companyType: "Information Technology",
  logoUrl: null,
  coverPhotoUrl: null,
  overview: `
    <p>As a cornerstone of FPT Corporation, a leader in integrated solutions and IT services in Vietnam for nearly three decades, FPT IS proudly stands as a trusted partner committed to co-creating future value through technology alongside top enterprises and organizations, both domestically and globally.</p>
    <p>Recognized for its technical expertise by customers and partners worldwide, FPT IS has been instrumental in designing and implementing comprehensive IT products, projects, and platforms across finance, public services, telecommunications, healthcare, and education.</p>
  `,
  benefits: `
    <ul>
      <li>Lương tháng 13 và thưởng KPI. Xem xét tăng lương hằng năm.</li>
      <li>Môi trường làm việc thân thiện, năng động.</li>
      <li>Được tham gia bảo hiểm đầy đủ theo quy định của pháp luật và khám sức khỏe định kỳ hằng năm.</li>
      <li>Được tham gia bảo hiểm FPTCare cho bản thân và gia đình.</li>
      <li>Được học hỏi, đào tạo và tham gia vào các dự án phần mềm lớn theo xu hướng công nghệ 4.0 trong lĩnh vực: Chính phủ, Y tế 4.0, SmartCity, Doanh nghiệp, Ngân hàng...</li>
      <li>Tham gia các hoạt động văn hoá, sự kiện hấp dẫn của Công ty FPT IS và Tập đoàn FPT.</li>
      <li>Du lịch/nghỉ mát cùng công ty hằng năm.</li>
      <li>Thời gian làm việc từ thứ 2 - thứ 6 (8h00 - 17h30).</li>
      <li>12 ngày phép, 03 ngày nghỉ mát/năm và các ngày nghỉ Lễ theo quy định.</li>
    </ul>
  `,
  teamPhotoUrls: ["Team Event 1", "Team Event 2", "Team Event 3"],
  teamSize: "Hơn 1000",
  slug: "fpt-is",
  companyBranches: [
    {
      id: "953f1b63-4c4d-4bb9-b7d3-fc9429b49059",
      companyId: "f3f52d35-3b68-46f5-9c62-14444ad7b3dd",
      name: "FPT IS Hồ Chí Minh",
      address:
        "Đường Sáng Tạo, KCX Tân Thuận, Phường Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh",
      city: "Thành phố Hồ Chí Minh",
      citySlug: "ho-chi-minh",
    },
    {
      id: "76a5939c-6812-4db8-8e6b-54f53278103e",
      companyId: "f3f52d35-3b68-46f5-9c62-14444ad7b3dd",
      name: "FPT IS Hà Nội",
      address: "Quận Nam Từ Liêm, Hà Nội",
      city: "Hà Nội",
      citySlug: "ha-noi",
    },
    {
      id: "ee67c968-e442-410b-8194-1675926130f2",
      companyId: "f3f52d35-3b68-46f5-9c62-14444ad7b3dd",
      name: "FPT IS Cầu Giấy",
      address: "Quận Cầu Giấy, Hà Nội",
      city: "Hà Nội",
      citySlug: "ha-noi",
    },
  ],
}

const companyJobsResponse: JobCard[] = [
  {
    id: "fbda6cfd-4c78-46ed-b142-59adfd2c642f",
    title: "AI ENGINEER (INSURANCE DOMAIN)",
    companyName: "FPT IS",
    companyImage: null,
    salaryRange: "Thương lượng",
    experienceRequirement: "3 năm",
    workType: "Onsite",
    expiredAt: "2026-07-31T17:00:00+07:00",
    tags: ["Java", "Python", "AI"],
    slug: "ai-engineer-insurance-domain",
    city: "Hà Nội",
    jobLevels: [
      "Middle",
      "Senior",
    ],
  },
  {
    id: "e198671c-1a06-4330-99ef-4e54903b6682",
    title: "BACKEND DEVELOPER (.NET)",
    companyName: "FPT IS",
    companyImage: null,
    salaryRange: "25 - 40 triệu",
    experienceRequirement: "4 năm",
    workType: "Hybrid",
    expiredAt: "2026-08-15T17:00:00+07:00",
    tags: [".NET", "C#", "SQL Server"],
    slug: "backend-developer-dotnet",
    city: "Thành phố Hồ Chí Minh",
    jobLevels: [
      "Senior",
    ],
  },
  {
    id: "f6dd5bc4-3942-4289-9a2d-e15133f0fe6f",
    title: "BUSINESS ANALYST (BANKING)",
    companyName: "FPT IS",
    companyImage: null,
    salaryRange: "20 - 35 triệu",
    experienceRequirement: "2 năm",
    workType: "Onsite",
    expiredAt: "2026-08-31T17:00:00+07:00",
    tags: ["BA", "Banking", "Agile"],
    slug: "business-analyst-banking",
    city: "Hà Nội",
    jobLevels: [
      "Middle",
    ],
  },
]

async function getCompanyBySlug(slug: string) {
  // TODO: replace with GET /api/companies/{slug}
  return companyResponse.slug === slug ? companyResponse : companyResponse
}

async function getCompanyJobs(_companyId: string) {
  // TODO: replace with GET /api/companies/{companyId}/jobs
  void _companyId

  return companyJobsResponse
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  const jobs = await getCompanyJobs(company.id)

  return (
    <UserContainer className="py-6">
      <main className="space-y-5">
        <CompanyHero company={company} />

        <InfoSection title="Tổng quan công ty">
          <HtmlContent html={company.overview ?? ""} />
          <Button className="mt-2 px-0" size="sm" variant="ghost">
            see more
          </Button>
        </InfoSection>

        <InfoSection title="Chi nhánh công ty">
          <div className="grid gap-3 md:grid-cols-2">
            {company.companyBranches.map((branch) => (
              <article key={branch.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <MapPin className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium leading-5">
                      {branch.name ?? "Chi nhánh công ty"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {branch.city ?? "Chưa cập nhật thành phố"}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {branch.address ?? "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Chế độ đãi ngộ">
          <HtmlContent html={company.benefits ?? ""} />
        </InfoSection>

        <InfoSection title="Đội ngũ của chúng tôi">
          <div className="grid gap-3 sm:grid-cols-3">
            {company.teamPhotoUrls.map((photo, index) => (
              <div
                key={photo}
                className="flex aspect-video items-center justify-center rounded-md bg-muted text-sm text-muted-foreground"
              >
                {index === company.teamPhotoUrls.length - 1
                  ? `${photo} +1`
                  : photo}
              </div>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Việc làm đang tuyển dụng">
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <CompanyJobCard key={job.id} job={job} />
            ))}
          </div>
        </InfoSection>
      </main>
    </UserContainer>
  )
}

function CompanyHero({ company }: { company: Company }) {
  const primaryBranch = company.companyBranches[0]

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
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            {primaryBranch?.address ?? "Chưa cập nhật địa chỉ"}
          </p>
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

  return (
    <article className="rounded-xl border p-4">
      <div className="grid grid-cols-[2.5rem_1fr_auto] gap-3">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted text-xs text-muted-foreground">
          {job.companyImage ? (
            <span
              aria-label={`${job.companyName} logo`}
              className="size-full bg-contain bg-center bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url(${job.companyImage})` }}
            />
          ) : (
            "LOGO"
          )}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5">
            {job.title ?? "Chưa cập nhật tiêu đề"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {job.companyName}
          </p>
        </div>

        <Button aria-label="Lưu công việc" size="icon-sm" variant="ghost">
          <Heart />
        </Button>
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
