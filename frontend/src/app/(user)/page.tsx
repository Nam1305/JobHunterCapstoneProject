import {
  Brain,
  BriefcaseBusiness,
  Building2,
  ChartBar,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  MapPin,
  MessageSquare,
  Search,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserContainer } from "@/components/user/user-container"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { JobCard } from "@/types/job"

const companies = [
  {
    name: "FPT Software",
    slug: "fpt-software",
    field: "Technology",
    jobs: 127,
    mark: "FPT",
  },
  {
    name: "VNG Corporation",
    slug: "vng-corporation",
    field: "Gaming",
    jobs: 89,
    mark: "VNG",
  },
  {
    name: "Shopee Vietnam",
    slug: "shopee-vietnam",
    field: "E-commerce",
    jobs: 156,
    mark: "SP",
  },
  {
    name: "Tiki",
    slug: "tiki",
    field: "E-commerce",
    jobs: 73,
    mark: "TK",
  },
  {
    name: "MOMO",
    slug: "momo",
    field: "Fintech",
    jobs: 94,
    mark: "MM",
  },
  {
    name: "ViettelPay",
    slug: "viettelpay",
    field: "Fintech",
    jobs: 68,
    mark: "VT",
  },
]

const jobs: JobCard[] = [
  {
    id: "8fb4f462-8c3e-43fd-a75c-2c95e1e81668",
    title: "Senior Frontend Developer",
    companyName: "FPT Software",
    companyImage: null,
    salaryRange: "25 - 40 triệu",
    experienceRequirement: "5 năm",
    workType: "Onsite",
    expiredAt: "2026-07-05T17:00:00+07:00",
    tags: ["ReactJS", "TypeScript"],
    slug: "senior-frontend-developer",
    city: "Hà Nội",
    jobLevels: ["Trưởng phòng"],
  },
  {
    id: "4f92074a-f40d-4f62-afc1-e314d4ac6a26",
    title: "Backend Engineer (NodeJS)",
    companyName: "VNG Corporation",
    companyImage: null,
    salaryRange: "30 - 50 triệu",
    experienceRequirement: "4 năm",
    workType: "Onsite",
    expiredAt: "2026-07-10T17:00:00+07:00",
    tags: ["NodeJS", "Backend"],
    slug: "backend-engineer-nodejs",
    city: "TP.HCM",
    jobLevels: ["Senior"],
  },
  {
    id: "c84e3daf-aac0-4b2a-a5a7-302d7d9f5969",
    title: "UI/UX Designer",
    companyName: "Shopee Vietnam",
    companyImage: null,
    salaryRange: "Thương lượng",
    experienceRequirement: "3 năm",
    workType: "Hybrid",
    expiredAt: "2026-07-18T17:00:00+07:00",
    tags: ["Figma", "UI/UX"],
    slug: "ui-ux-designer",
    city: "TP.HCM",
    jobLevels: ["Middle"],
  },
  {
    id: "af451029-bd76-4311-a958-40fe619881c4",
    title: "Data Engineer",
    companyName: "Tiki",
    companyImage: null,
    salaryRange: "28 - 45 triệu",
    experienceRequirement: "4 năm",
    workType: "Remote",
    expiredAt: "2026-07-22T17:00:00+07:00",
    tags: ["Python", "Data"],
    slug: "data-engineer",
    city: "Hà Nội",
    jobLevels: ["Senior"],
  },
  {
    id: "5cfdb724-e94e-4b20-a7cd-a81edae0c402",
    title: "Product Manager",
    companyName: "MOMO",
    companyImage: null,
    salaryRange: "35 - 60 triệu",
    experienceRequirement: "6 năm",
    workType: "Hybrid",
    expiredAt: "2026-08-01T17:00:00+07:00",
    tags: ["Product", "Fintech"],
    slug: "product-manager",
    city: "TP.HCM",
    jobLevels: ["Trưởng phòng"],
  },
  {
    id: "1d264352-4094-4640-ae55-b3ad79eac40c",
    title: "DevOps Engineer",
    companyName: "ViettelPay",
    companyImage: null,
    salaryRange: "30 - 50 triệu",
    experienceRequirement: "5 năm",
    workType: "Onsite",
    expiredAt: "2026-08-08T17:00:00+07:00",
    tags: ["DevOps", "Cloud"],
    slug: "devops-engineer",
    city: "Hà Nội",
    jobLevels: ["Senior"],
  },
]

const tools = [
  {
    title: "Tạo CV",
    description:
      "Tạo CV chuyên nghiệp chỉ trong vài phút với các mẫu được thiết kế sẵn.",
    icon: FileText,
  },
  {
    title: "Hoàn thành hồ sơ",
    description:
      "Bổ sung đầy đủ thông tin cá nhân để tăng cơ hội được nhà tuyển dụng chú ý.",
    icon: UserCheck,
  },
  {
    title: "Trắc nghiệm tính cách",
    description:
      "Khám phá điểm mạnh và phong cách làm việc phù hợp với bạn.",
    icon: Brain,
  },
  {
    title: "Câu hỏi phỏng vấn",
    description:
      "Luyện tập với bộ câu hỏi phỏng vấn phổ biến theo từng ngành nghề.",
    icon: MessageSquare,
  },
]

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-normal text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
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

function getCompanySlug(companyName: string) {
  return (
    companies.find((company) => company.name === companyName)?.slug ??
    companyName.toLowerCase().replace(/\s+/g, "-")
  )
}

export default function UserHomePage() {
  return (
    <div className="bg-background text-foreground">
      <section className="border-b bg-muted/30">
        <UserContainer className="flex min-h-110 flex-col items-center justify-center py-16 text-center lg:py-20">
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-balance sm:text-5xl lg:text-6xl">
            Bắt đầu hành trình sự nghiệp mới
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Hàng nghìn cơ hội việc làm từ các công ty hàng đầu Việt Nam đang
            chờ đón bạn
          </p>

          {/* Search bar */}
          <div className="mt-10 w-full max-w-3xl rounded-lg border bg-background p-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-10 pl-9"
                  placeholder="Tìm kiếm công việc, công ty, kỹ năng..."
                  type="search"
                />
              </div>
              <div className="w-full shrink-0 sm:w-48">
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả địa điểm</SelectItem>
                    <SelectItem value="ha-noi">Hà Nội</SelectItem>
                    <SelectItem value="tp-hcm">TP.HCM</SelectItem>
                    <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/cong-viec">Tìm kiếm</Link>
              </Button>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <BriefcaseBusiness className="size-4" />
              50,000+ việc làm
            </span>
            <span className="inline-flex items-center gap-2">
              <Building2 className="size-4" />
              10,000+ công ty
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="size-4" />
              100,000+ ứng viên
            </span>
          </div>
        </UserContainer>
      </section>

      <section className="py-20">
        <UserContainer>
          <div className="flex items-start justify-between gap-4">
            <SectionHeading
              title="Công ty hàng đầu"
              description="Các nhà tuyển dụng uy tín đang tìm kiếm nhân tài"
            />
            <Button variant="ghost" asChild>
              <Link href="/cong-ty">
                Xem tất cả
                <ChevronRight />
              </Link>
            </Button>
          </div>

          <Carousel
            className="mt-10"
            opts={{
              align: "center",
            }}
          >
            <CarouselContent className="py-1">
              {companies.map((company) => (
                <CarouselItem
                  key={company.name}
                  className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <Link
                    className="block h-full rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    href={`/cong-ty/${company.slug}`}
                  >
                    <Card size="sm" className="h-full">
                      <CardContent className="flex h-full flex-col items-center space-y-4 text-center">
                        <div className="flex size-14 items-center justify-center rounded-lg border bg-muted text-xs font-semibold text-muted-foreground">
                          {company.mark}
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <Badge variant="secondary" className="mt-2">
                            {company.field}
                          </Badge>
                        </div>
                        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <BriefcaseBusiness className="size-4" />
                          {company.jobs} vị trí
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:inline-flex" />
            <CarouselNext className="hidden md:inline-flex" />
          </Carousel>
        </UserContainer>
      </section>

      <section className="border-y bg-muted/30 py-20">
        <UserContainer>
          <div className="flex items-start justify-between gap-4">
            <SectionHeading
              title="Top việc làm"
              description="Những cơ hội nghề nghiệp hấp dẫn nhất trong tuần"
            />
            <Button variant="ghost" asChild>
              <Link href="/cong-viec">
                Xem tất cả
                <ChevronRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="group relative">
                <Link
                  aria-label={`Xem việc làm ${job.title ?? ""}`}
                  className="absolute inset-0 rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  href={`/cong-viec/${job.slug}`}
                />
                <CardContent className="relative">
                  <div className="flex items-start gap-3">
                    <Link
                      className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-xs font-semibold text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      href={`/cong-ty/${getCompanySlug(job.companyName)}`}
                      aria-label={`Xem công ty ${job.companyName}`}
                    >
                      {job.companyImage ? (
                        <span
                          aria-label={`${job.companyName} logo`}
                          className="size-full rounded-lg bg-contain bg-center bg-no-repeat"
                          role="img"
                          style={{ backgroundImage: `url(${job.companyImage})` }}
                        />
                      ) : (
                        getCompanyMark(job.companyName)
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold leading-5 text-foreground">
                          <Link
                            className="relative z-10 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                            href={`/cong-viec/${job.slug}`}
                          >
                            {job.title}
                          </Link>
                        </h3>
                      </div>
                      <Link
                        className="relative z-10 mt-0.5 inline-block text-xs text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        href={`/cong-ty/${getCompanySlug(job.companyName)}`}
                      >  {/* ← sm→xs, mt-1→mt-0.5 */}
                        {job.companyName}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">  {/* ← mt-5→mt-3, gap-x-6→gap-x-4, gap-y-3→gap-y-2, text-sm→text-xs */}
                    <p className="col-span-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">  {/* ← gap-2→gap-1.5, added text-sm to keep salary readable */}
                      <WalletCards className="size-3.5" />  {/* ← size-4→size-3.5 */}
                      {job.salaryRange ?? "Thương lượng"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3" />  {/* ← size-4→size-3 */}
                      {job.city}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <ChartBar className="size-3" />
                      {job.jobLevels.join(", ") || "Chưa cập nhật"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="size-3" />
                      {job.workType ?? "Chưa cập nhật"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="size-3" />
                      {job.experienceRequirement ?? "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-3">  {/* ← mt-5→mt-3, pt-4→pt-3 */}
                    <p className="text-xs text-muted-foreground">
                      {formatDaysUntil(job.expiredAt)}
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label="Lưu việc làm"
                        className="relative z-10"
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Heart />
                      </Button>
                      <Button className="relative z-10">Ứng tuyển</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </UserContainer>
      </section>

      <section className="py-20">
        <UserContainer>
          <SectionHeading
            title="Công cụ hỗ trợ"
            description="Mọi thứ bạn cần để chinh phục nhà tuyển dụng"
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <Card key={tool.title}>
                <CardContent className="space-y-6">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                    <tool.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </UserContainer>
      </section>
    </div>
  )
}
