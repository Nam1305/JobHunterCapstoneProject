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
import { getImageUrl } from "@/lib/utils"
import { getTopCompanies } from "@/data/companies"
import { getTopJobs } from "@/data/jobs"


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

function getCompanySlug(companyName: string | null | undefined) {
  return (companyName ?? "company")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}


export default async function UserHomePage() {
  const [topJobs, topCompanies] = await Promise.all([
    getTopJobs(),
    getTopCompanies(),
  ])

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
              {topCompanies.map((company) => {
                const logoUrl = getImageUrl(company.logoUrl)

                return (
                  <CarouselItem
                    key={company.id}
                    className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/6"
                  >
                    <Link
                      className="block h-full rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      href={`/cong-ty/${company.slug || getCompanySlug(company.name)}`}
                    >
                      <Card size="sm" className="h-full">
                        <CardContent className="flex h-full flex-col items-center space-y-4 text-center">
                          <div className="flex size-14 items-center justify-center overflow-hidden rounded-lg border bg-muted text-xs font-semibold text-muted-foreground">
                            {logoUrl ? (
                              <span
                                aria-label={`${company.name} logo`}
                                className="size-full rounded-lg bg-contain bg-center bg-no-repeat"
                                role="img"
                                style={{ backgroundImage: `url("${logoUrl}")` }}
                              />
                            ) : (
                              getCompanyMark(company.name)
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{company.name}</h3>
                            <Badge variant="secondary" className="mt-2">
                              {company.companyType ?? "Chưa cập nhật"}
                            </Badge>
                          </div>
                          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <BriefcaseBusiness className="size-4" />
                            {company.openingVacancies} vị trí
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:inline-flex" />
            <CarouselNext className="hidden md:inline-flex" />
          </Carousel>
          {topCompanies.length === 0 ? (
            <p className="mt-10 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              Chưa có công ty nổi bật.
            </p>
          ) : null}
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
            {topJobs.map((job) => {
              const companyImage = getImageUrl(job.companyImage)

              return (
                <Card key={job.id} className="group relative">
                  <Link
                    aria-label={`Xem việc làm ${job.title ?? ""}`}
                    className="absolute inset-0 rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    href={`/cong-viec/${job.slug ?? job.id}`}
                  />
                  <CardContent className="relative">
                    <div className="flex items-start gap-3">
                      <Link
                        className="relative z-10 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-xs font-semibold text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        href={`/cong-ty/${getCompanySlug(job.companyName)}`}
                        aria-label={`Xem công ty ${job.companyName}`}
                      >
                        {companyImage ? (
                          <span
                            aria-label={`${job.companyName} logo`}
                            className="size-full rounded-lg bg-contain bg-center bg-no-repeat"
                            role="img"
                            style={{
                              backgroundImage: `url("${companyImage}")`,
                            }}
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
                              href={`/cong-viec/${job.slug ?? job.id}`}
                            >
                              {job.title ?? "Chưa cập nhật tiêu đề"}
                            </Link>
                          </h3>
                        </div>
                        <Link
                          className="relative z-10 mt-0.5 inline-block text-xs text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                          href={`/cong-ty/${getCompanySlug(job.companyName)}`}
                        >
                          {job.companyName}
                        </Link>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <p className="col-span-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <WalletCards className="size-3.5" />
                        {job.salaryRange ?? "Thương lượng"}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3" />
                        {job.city || "Chưa cập nhật"}
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

                    <div className="mt-3 flex items-center justify-between border-t pt-3">
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
              )
            })}
          </div>
          {topJobs.length === 0 ? (
            <p className="mt-10 rounded-lg border border-dashed bg-background py-10 text-center text-sm text-muted-foreground">
              Chưa có việc làm nổi bật.
            </p>
          ) : null}

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
