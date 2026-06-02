import {
  Building2,
  Clock,
  Globe,
  Heart,
  MessageCircle,
  MapPin,
  Network,
  Plus,
  Users,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"

const company = {
  name: "FPT IS",
  logo: "LOGO",
  tagline: "Best Companies To Work For In Asia 2023",
  address:
    "Đường Sáng Tạo, KCX Tân Thuận, Phường Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh",
  country: "Vietnam",
  industries: [
    "Information Technology",
    "B2B Services",
    "Technology and Computer Sciences",
  ],
  size: "Hơn 1000",
  descriptionHtml: `
    <p>As a cornerstone of FPT Corporation, a leader in integrated solutions and IT services in Vietnam for nearly three decades, FPT IS proudly stands as a trusted partner committed to co-creating future value through technology alongside top enterprises and organizations, both domestically and globally.</p>
    <p>Recognized for its technical expertise by customers and partners worldwide, FPT IS has been instrumental in designing and implementing comprehensive IT products, projects, and platforms across finance, public services, telecommunications, healthcare, and education.</p>
  `,
  benefitsHtml: `
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
  photos: ["Team Event 1", "Team Event 2", "Team Event 3"],
}

const jobs = [
  {
    title: "AI ENGINEER (INSURANCE DOMAIN)",
    salary: "Thương lượng",
    location: "Quận Nam Từ Liêm, Hà Nội",
    levels: "Middle, Senior",
    type: "Fulltime",
    experience: "3 năm",
    tags: ["Java", "Python", "AI"],
  },
  {
    title: "BACKEND DEVELOPER (.NET)",
    salary: "25 - 40 triệu",
    location: "Quận 7, TP. Hồ Chí Minh",
    levels: "Senior",
    type: "Fulltime",
    experience: "4 năm",
    tags: [".NET", "C#", "SQL Server"],
  },
  {
    title: "BUSINESS ANALYST (BANKING)",
    salary: "20 - 35 triệu",
    location: "Quận Cầu Giấy, Hà Nội",
    levels: "Middle",
    type: "Fulltime",
    experience: "2 năm",
    tags: ["BA", "Banking", "Agile"],
  },
]

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await params

  return (
    <UserContainer className="py-6">
      <main className="space-y-5">
        <CompanyHero />

        <InfoSection title="Tổng quan công ty">
          <HtmlContent html={company.descriptionHtml} />
          <Button className="mt-2 px-0" size="sm" variant="ghost">
            see more
          </Button>
        </InfoSection>

        <InfoSection title="Chế độ đãi ngộ">
          <HtmlContent html={company.benefitsHtml} />
        </InfoSection>

        <InfoSection title="Đội ngũ của chúng tôi">
          <div className="grid gap-3 sm:grid-cols-3">
            {company.photos.map((photo, index) => (
              <div
                key={photo}
                className="flex aspect-video items-center justify-center rounded-md bg-muted text-sm text-muted-foreground"
              >
                {index === company.photos.length - 1 ? `${photo} +1` : photo}
              </div>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Việc làm đang tuyển dụng">
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>
        </InfoSection>
      </main>
    </UserContainer>
  )
}

function CompanyHero() {
  return (
    <Card className="gap-0 py-0">
      <div className="flex h-56 items-center justify-center rounded-t-2xl border-b bg-muted text-sm text-muted-foreground">
        Cover photo
      </div>

      <CardContent className="space-y-5 pb-6 pt-0">
        <div className="-mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex size-20 items-center justify-center rounded-lg border bg-card text-xs text-muted-foreground shadow-sm">
            {company.logo}
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
          <p className="text-sm text-muted-foreground">{company.tagline}</p>
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            {company.address}
          </p>
        </div>

        <Separator />

        <dl className="grid gap-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Quốc gia</dt>
            <dd className="mt-2">🇻🇳 {company.country}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngành nghề</dt>
            <dd className="mt-2 space-y-1">
              {company.industries.map((industry) => (
                <div key={industry}>{industry}</div>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Quy mô công ty</dt>
            <dd className="mt-2">{company.size}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <Globe className="size-4" />
            Website công ty
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircle className="size-4" />
            Fanpage công ty
          </span>
          <span className="inline-flex items-center gap-2">
            <Network className="size-4" />
            LinkedIn công ty
          </span>
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

function JobCard({
  job,
}: {
  job: (typeof jobs)[number]
}) {
  return (
    <article className="rounded-xl border p-4">
      <div className="grid grid-cols-[2.5rem_1fr_auto] gap-3">
        <div className="flex size-10 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
          LOGO
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5">
            {job.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{company.name}</p>
        </div>

        <Button aria-label="Lưu công việc" size="icon-sm" variant="ghost">
          <Heart />
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <WalletCards className="size-3.5 shrink-0" />
        {job.salary}
      </p>

      <div className="mt-3 grid gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5 shrink-0" />
          {job.levels}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          {job.type}
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="size-3.5 shrink-0" />
          {job.experience}
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
