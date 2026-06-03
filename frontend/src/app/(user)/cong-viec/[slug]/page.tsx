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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContainer } from "@/components/user/user-container"
import type { CompanyCard as CompanyCardData } from "@/types/company"
import type { JobCard, JobDetails } from "@/types/job"

const job: JobDetails = {
  id: "5a5f1e2b-49cb-4f14-a6c9-8d49c8f994a0",
  companyId: "fedf1fc7-1765-4df9-a39c-ef34c070054d",
  branchId: "0f7a5db5-a75d-44a6-b167-fdc5c8b8d826",
  subcategoryId: null,
  title: "Content Marketing",
  companyName: "DaouKiwoom Innovation",
  companyImage: null,
  salaryRange: "9.000.000 VND - 13.000.000 VND",
  responsibilities:
    "Lập kế hoạch, xây dựng và quản lý lịch nội dung cho các nền tảng mạng xã hội như Facebook, LinkedIn, TikTok.\nViết bài blog hấp dẫn, thân thiện với SEO nhằm tăng lưu lượng truy cập tự nhiên và mang lại giá trị cho người đọc.\nXây dựng kịch bản và chỉnh sửa cơ bản cho video ngắn trên TikTok, Reels, Shorts để tăng mức độ tương tác với thương hiệu.\nPhối hợp chặt chẽ với Designer để sản xuất nội dung hình ảnh hỗ trợ các chiến dịch tiếp thị.",
  requirements:
    "Có 1-3 năm kinh nghiệm trong tiếp thị nội dung, quản lý mạng xã hội hoặc viết quảng cáo.\nKỹ năng viết tốt, có khả năng điều chỉnh giọng văn và phong cách cho từng nền tảng.\nBiết sử dụng các công cụ như CapCut, Canva hoặc ứng dụng chỉnh sửa trên điện thoại để tạo video mạng xã hội.\nCó hiểu biết cơ bản về SEO và cách viết bài blog đạt hiệu quả trên công cụ tìm kiếm.",
  experienceRequirement: "1 năm, 3 năm",
  benefits:
    "Mức lương cạnh tranh cùng thưởng hiệu suất theo quý.\nLương tháng 13 và đầy đủ bảo hiểm xã hội theo quy định pháp luật Việt Nam.\nThời gian làm việc linh hoạt với 2 ngày làm việc từ xa mỗi tuần.\nDu lịch công ty hằng năm và ngân sách cho hoạt động gắn kết đội nhóm.",
  workType: "Hybrid",
  expiredAt: "2026-06-14T17:00:00+07:00",
  tags: [
    "Viết nội dung",
    "SEO",
    "Canva",
    "CapCut",
    "Mạng xã hội",
    "Viết quảng cáo",
    "Quảng cáo TikTok",
    "Phân tích dữ liệu",
  ],
  slug: "content-marketing",
  city: "Hồ Chí Minh",
  branch: {
    id: "0f7a5db5-a75d-44a6-b167-fdc5c8b8d826",
    companyId: "fedf1fc7-1765-4df9-a39c-ef34c070054d",
    name: "DaouKiwoom Innovation",
    address: "Quận Bình Thạnh, Hồ Chí Minh",
    city: "Hồ Chí Minh",
    citySlug: "ho-chi-minh",
  },
  jobLevels: ["Junior", "Middle", "Senior"],
  applicants: 58,
}

const company: CompanyCardData = {
  id: "fedf1fc7-1765-4df9-a39c-ef34c070054d",
  name: "DaouKiwoom Innovation",
  slug: "daoukiwoom-innovation",
  logoUrl: null,
  coverPhotoUrl: null,
  companyType: "Tài chính, Tuyển dụng, Webtoon",
  teamSize: "100-499 nhân viên",
  country: "Hàn Quốc",
  openingVacancies: 12,
  numberOfFollowers: 58,
}

const companyJobs: JobCard[] = [
  {
    id: "4391ec7a-7ac0-4f6f-9f1d-7d7cb66023b8",
    title: "Product Owner kiêm BA",
    companyName: "DaouKiwoom Innovation",
    companyImage: null,
    salaryRange: "Lên tới 25.000.000 VND",
    experienceRequirement: null,
    workType: "Hybrid",
    expiredAt: "2026-07-05T17:00:00+07:00",
    tags: ["Product Owner", "Phân tích nghiệp vụ"],
    slug: "product-owner-kiem-ba",
    city: "Hồ Chí Minh",
    jobLevels: ["Middle"],
  },
  {
    id: "932ceea6-a7ee-42bc-ae4f-9562c9819d2b",
    title: "Lập trình viên Web Front-end",
    companyName: "DaouKiwoom Innovation",
    companyImage: null,
    salaryRange: "Lên tới 40.000.000 VND",
    experienceRequirement: null,
    workType: "Hybrid",
    expiredAt: "2026-07-15T17:00:00+07:00",
    tags: ["HTML5", "JavaScript", "ReactJS", "+2"],
    slug: "lap-trinh-vien-web-front-end",
    city: "Hồ Chí Minh",
    jobLevels: ["Middle", "Senior"],
  },
  {
    id: "2ebf5df9-f26c-4349-ab98-0e02df31cfd3",
    title: "Lập trình viên Server C",
    companyName: "DaouKiwoom Innovation",
    companyImage: null,
    salaryRange: "45.000.000VND",
    experienceRequirement: null,
    workType: "Onsite",
    expiredAt: "2026-07-20T17:00:00+07:00",
    tags: ["Agile", "Git", "Ngôn ngữ C"],
    slug: "lap-trinh-vien-server-c",
    city: "Hồ Chí Minh",
    jobLevels: ["Senior"],
  },
]

const similarJobs: JobCard[] = [
  {
    id: "99c48a14-34b2-41a4-936e-2fdf662761bd",
    title: "Lập trình viên Frontend Senior",
    companyName: "FPT Software",
    companyImage: null,
    salaryRange: "25 - 40 triệu VND",
    experienceRequirement: null,
    workType: "Hybrid",
    expiredAt: "2026-07-10T17:00:00+07:00",
    tags: ["ReactJS", "TypeScript"],
    slug: "lap-trinh-vien-frontend-senior",
    city: "Hà Nội",
    jobLevels: ["Senior"],
  },
  {
    id: "5f674b08-0842-45a7-8e9b-725e31d6a0bb",
    title: "Kỹ sư Backend NodeJS",
    companyName: "VNG Corporation",
    companyImage: null,
    salaryRange: "30 - 50 triệu VND",
    experienceRequirement: null,
    workType: "Onsite",
    expiredAt: "2026-07-12T17:00:00+07:00",
    tags: ["NodeJS", "MongoDB"],
    slug: "ky-su-backend-nodejs",
    city: "Hồ Chí Minh",
    jobLevels: ["Senior"],
  },
  {
    id: "ed10d86e-1b6d-4101-ba0e-9aacaa4498f7",
    title: "Chuyên viên thiết kế UI/UX",
    companyName: "Shopee Vietnam",
    companyImage: null,
    salaryRange: "20 - 35 triệu VND",
    experienceRequirement: null,
    workType: "Hybrid",
    expiredAt: "2026-07-18T17:00:00+07:00",
    tags: ["Figma", "Design System"],
    slug: "chuyen-vien-thiet-ke-ui-ux",
    city: "Hồ Chí Minh",
    jobLevels: ["Middle"],
  },
  {
    id: "8a7ba205-654d-4271-b238-a8ca8ee2f690",
    title: "Kỹ sư dữ liệu",
    companyName: "Tiki",
    companyImage: null,
    salaryRange: "28 - 45 triệu VND",
    experienceRequirement: null,
    workType: "Remote",
    expiredAt: "2026-07-25T17:00:00+07:00",
    tags: ["Python", "BigQuery"],
    slug: "ky-su-du-lieu",
    city: "Hà Nội",
    jobLevels: ["Senior"],
  },
  {
    id: "4fe047d7-a0e0-406d-8f2e-0771b428bbf6",
    title: "Quản lý sản phẩm",
    companyName: "MOMO",
    companyImage: null,
    salaryRange: "35 - 60 triệu VND",
    experienceRequirement: null,
    workType: "Hybrid",
    expiredAt: "2026-08-01T17:00:00+07:00",
    tags: ["Fintech", "Agile"],
    slug: "quan-ly-san-pham",
    city: "Hồ Chí Minh",
    jobLevels: ["Trưởng phòng"],
  },
]

function textItems(value: string | null) {
  return value?.split("\n").filter(Boolean) ?? []
}

const jobSections = [
  {
    title: "TRÁCH NHIỆM",
    icon: Sparkles,
    items: textItems(job.responsibilities),
  },
  {
    title: "YÊU CẦU",
    icon: ClipboardCheck,
    items: textItems(job.requirements),
  },
  {
    title: "PHÚC LỢI",
    icon: Gift,
    items: textItems(job.benefits),
  },
].filter((section) => section.items.length > 0)

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
  return (
    <div
      className={`${sizeClassName} flex items-center justify-center overflow-hidden rounded-md border bg-muted text-xs text-muted-foreground`}
    >
      {image ? (
        <span
          aria-label={`${name} logo`}
          className="size-full bg-contain bg-center bg-no-repeat"
          role="img"
          style={{ backgroundImage: `url(${image})` }}
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
  await params

  return (
    <UserContainer className="py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18.25rem] lg:items-start">
        <main className="space-y-5">
          <Card>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-normal">
                  {job.title}
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
                  {job.city}
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
              {jobSections.map((section, index) => (
                <section key={section.title} className="space-y-3">
                  {index > 0 ? <Separator /> : null}
                  {/* was font-semibold tracking-wide — too heavy on all-caps Vietnamese */}
                  <div className="flex items-center gap-2 pt-1">
                    <section.icon className="size-3.5 text-muted-foreground" />
                    <h2 className="text-xs font-medium tracking-widest text-muted-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-2.5 pl-4 text-sm leading-7 text-muted-foreground">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="list-disc pl-1 marker:text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="space-y-3">
                <Separator />
                <div className="flex items-center gap-2 pt-1">
                  <Code2 className="size-3.5 text-muted-foreground" />
                  <h2 className="text-xs font-medium tracking-widest text-muted-foreground">
                    KỸ NĂNG YÊU CẦU
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">
                Việc làm tương tự
              </h2>

              <div className="mt-4 space-y-3">
                {similarJobs.map((similarJob) => (
                  <SimilarJobRow key={similarJob.id} job={similarJob} />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <CompanyCard />
          <CompanyJobsCard />
        </aside>
      </div>
    </UserContainer>
  )
}

function CompanyCard() {
  return (
    <Card className="gap-0 py-0">
      <div className="relative h-18 border-b bg-muted">
        {company.coverPhotoUrl ? (
          <span
            aria-label={`${company.name} cover`}
            className="absolute inset-0 bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url(${company.coverPhotoUrl})` }}
          />
        ) : (
          <BriefcaseIcon className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
        )}
        <div className="absolute -bottom-5 left-4 flex size-10 items-center justify-center rounded-md border bg-card text-xs font-semibold">
          {company.logoUrl ? (
            <span
              aria-label={`${company.name} logo`}
              className="size-full bg-contain bg-center bg-no-repeat"
              role="img"
              style={{ backgroundImage: `url(${company.logoUrl})` }}
            />
          ) : (
            getCompanyMark(company.name)
          )}
        </div>
      </div>

      <CardContent className="px-4 pb-3 pt-7">
        <h2 className="text-sm font-semibold leading-5">{company.name}</h2>

        <dl className="mt-3 text-xs">
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Ngành nghề</dt>
            {/* dropped font-medium — text-xs doesn't need it */}
            <dd>{company.companyType}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quy mô</dt>
            <dd>{company.teamSize}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quốc gia</dt>
            <dd>{company.country}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Theo dõi</dt>
            <dd>{company.numberOfFollowers} người</dd>
          </div>
        </dl>
      </CardContent>

      <Separator />

      <div className="flex items-center px-4 py-2.5 text-xs text-muted-foreground">
        <BriefcaseIcon className="mr-1.5 size-3.5 shrink-0" />
        <span>
          <span className="font-semibold text-foreground">
            {company.openingVacancies}
          </span>
          {" việc làm đang tuyển"}
        </span>
      </div>

      <Separator />

      <div className="px-4 py-2 text-center">
        <Button variant="ghost" size="sm">
          Xem công ty
          <ExternalLink className="size-3.5" />
        </Button>
      </div>
    </Card>
  )
}

function CompanyJobsCard() {
  return (
    <Card>
      <CardContent>
        <h2 className="text-sm font-semibold">
          {companyJobs.length} việc làm cùng công ty
        </h2>

        <div className="mt-4 space-y-4">
          {companyJobs.map((job, index) => (
            <div key={job.id}>
              <div className="grid grid-cols-[2rem_1fr_auto] gap-3">
                <CompanyLogo
                  image={job.companyImage}
                  name={job.companyName}
                  sizeClassName="size-8"
                />

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5">
                    {job.title ?? "Chưa cập nhật tiêu đề"}
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
              {index < companyJobs.length - 1 ? (
                <Separator className="mt-4" />
              ) : null}
            </div>
          ))}
        </div>

        <Button className="mt-4 w-full" variant="ghost" size="sm">
          Xem thêm việc làm
          <ExternalLink className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
}

function SimilarJobRow({
  job,
}: {
  job: JobCard
}) {
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
              <h3 className="font-medium leading-5">
                {job.title ?? "Chưa cập nhật tiêu đề"}
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

        <Button className="w-full sm:hidden" size="sm">Ứng tuyển</Button>
      </div>
    </div>
  )
}
