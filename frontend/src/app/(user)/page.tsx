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
import { getImageUrl } from "@/lib/utils"
import { getTopCompanies } from "@/data/companies"
import { getTopJobs } from "@/data/jobs"
import { getCompanyMark, getCompanySlug } from "@/utils/company"
import { getDisplayJobTags } from "@/utils/job-tags"
import { formatDaysUntil } from "@/utils/jobs"

import { HomeJobSearch } from "./home-job-search"

/*
 * Component tree
 * UserHomePage
 * ├─ Hero/search section
 * │  └─ HomeJobSearch
 * ├─ Top companies section
 * │  ├─ SectionHeading
 * │  └─ Carousel
 * │     └─ Company card links
 * ├─ Top jobs section
 * │  ├─ SectionHeading
 * │  └─ Job cards
 * └─ Tools section
 *    ├─ SectionHeading
 *    └─ Tool cards
 */

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

// Renders a reusable section title and supporting description.
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

// Server page for the public user home experience.
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

          <HomeJobSearch />

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
                <Card key={job.id} className="group relative h-full">
                  <Link
                    aria-label={`Xem việc làm ${job.title ?? ""}`}
                    className="absolute inset-0 rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    href={`/cong-viec/${job.slug ?? job.id}`}
                  />
                  <CardContent className="relative flex h-full flex-col">
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

                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <p className="col-span-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        <WalletCards className="size-3.5 shrink-0" />
                        <span className="min-w-0 truncate">
                          {job.salaryRange ?? "Thương lượng"}
                        </span>
                      </p>
                      <p className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-3 shrink-0" />
                        <span className="min-w-0 truncate">
                          {job.city || "Chưa cập nhật"}
                        </span>
                      </p>
                      <p className="flex min-w-0 items-center gap-1.5">
                        <ChartBar className="size-3 shrink-0" />
                        <span className="min-w-0 truncate">
                          {job.jobLevels.join(", ") || "Chưa cập nhật"}
                        </span>
                      </p>
                      <p className="flex min-w-0 items-center gap-1.5">
                        <Clock className="size-3 shrink-0" />
                        <span className="min-w-0 truncate">
                          {job.workType ?? "Chưa cập nhật"}
                        </span>
                      </p>
                      <p className="flex min-w-0 items-center gap-1.5">
                        <BriefcaseBusiness className="size-3 shrink-0" />
                        <span className="min-w-0 truncate">
                          {job.experienceRequirement ?? "Chưa cập nhật"}
                        </span>
                      </p>
                    </div>

                    {job.tags.length > 0 ? (
                      <div className="my-3 flex min-w-0 flex-wrap gap-1.5">
                        {getDisplayJobTags(job.tags).map((tag, index) => (
                          <Badge
                            key={`${tag.label}-${index}`}
                            className="max-w-full"
                            variant="outline"
                          >
                            <span className="min-w-0 truncate">
                              {tag.label}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto flex items-center justify-between border-t pt-3">
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
