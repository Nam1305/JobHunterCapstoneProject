import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Building2,
  ChartBar,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Sparkles,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

import { ApplyJobButton } from "@/components/application/apply-job-button"
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
    description: "Khám phá điểm mạnh và phong cách làm việc phù hợp với bạn.",
    icon: Brain,
  },
  {
    title: "Câu hỏi phỏng vấn",
    description:
      "Luyện tập với bộ câu hỏi phỏng vấn phổ biến theo từng ngành nghề.",
    icon: MessageSquare,
  },
]

const heroStats = [
  {
    label: "Việc làm đang mở",
    value: "50,000+",
    icon: BriefcaseBusiness,
  },
  {
    label: "Công ty tuyển dụng",
    value: "10,000+",
    icon: Building2,
  },
  {
    label: "Ứng viên tin dùng",
    value: "100,000+",
    icon: Users,
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
  const heroFeaturedJobs = topJobs.slice(0, 3)
  const heroMatchScores = ["96%", "91%", "88%"]

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b bg-[linear-gradient(135deg,var(--background)_0%,var(--muted)_48%,var(--background)_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
        <UserContainer className="relative grid min-h-125 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:py-20">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <Badge
              variant="secondary"
              className="mb-5 h-8 gap-2 rounded-4xl border bg-background/80 px-3 text-foreground shadow-sm"
            >
              <Sparkles className="size-3.5 text-muted-foreground" />
              Cơ hội mới được cập nhật mỗi ngày
            </Badge>

            <h1 className="text-4xl font-semibold leading-[1.04] tracking-normal text-balance sm:text-5xl lg:text-6xl">
              Tìm công việc phù hợp với{" "}
              <span className="text-primary">mục tiêu của bạn.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:text-xl">
              Khám phá hàng nghìn cơ hội việc làm chất lượng từ các công ty hàng
              đầu Việt Nam. Dễ dàng lọc theo kỹ năng, địa điểm và mức lương mong
              muốn.
            </p>

            <div className="mx-auto max-w-3xl lg:mx-0">
              <HomeJobSearch />
            </div>

            <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/cong-viec">
                  Khám phá việc làm
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/cong-ty">Xem công ty nổi bật</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-background/70 p-4 text-left shadow-sm backdrop-blur"
                >
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <stat.icon className="size-4" />
                  </div>
                  <p className="text-2xl font-semibold leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border bg-background/85 p-5 shadow-2xl shadow-primary/10 backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    Việc làm phù hợp hôm nay
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Gợi ý dựa trên kỹ năng và mục tiêu nghề nghiệp
                  </p>
                </div>
                <Badge variant="outline" className="bg-background">
                  Live
                </Badge>
              </div>

              <div className="space-y-3">
                {heroFeaturedJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <BriefcaseBusiness className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {job.title ?? "Vị trí đang tuyển"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {job.companyName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {heroMatchScores[index]} phù hợp
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <WalletCards className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {job.salaryRange ?? "Thương lượng"}
                        </span>
                      </span>
                      <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {job.city || "Linh hoạt"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
                {heroFeaturedJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
                    Chưa có gợi ý việc làm nổi bật.
                  </div>
                ) : null}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <CheckCircle2 className="size-5 text-muted-foreground" />
                  <p className="mt-3 text-2xl font-semibold">24h</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Phản hồi nhanh từ nhà tuyển dụng
                  </p>
                </div>
                <div className="rounded-2xl border bg-muted/40 p-4">
                  <ChartBar className="size-5 text-muted-foreground" />
                  <p className="mt-3 text-2xl font-semibold">3x</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tăng cơ hội khi hồ sơ được hoàn thiện
                  </p>
                </div>
              </div>
            </div>
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
                    className="basis-11/12 sm:basis-2/3 md:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                  >
                    <Link
                      className="block h-full rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      href={`/cong-ty/${company.slug || getCompanySlug(company.name)}`}
                    >
                      <Card className="h-full min-h-62">
                        <CardContent className="flex h-full flex-col items-center justify-center space-y-4 px-7 text-center">
                          <div className="flex size-28 items-center justify-center overflow-hidden rounded-lg border bg-muted text-xs font-semibold text-muted-foreground">
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
                            <h3 className="text-sm font-semibold leading-tight">
                              {company.name}
                            </h3>
                            <Badge variant="secondary" className="mt-2">
                              {company.companyType ?? "Chưa cập nhật"}
                            </Badge>
                          </div>
                          <p className="flex items-center justify-center gap-1.5 text-xs leading-tight text-muted-foreground">
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
                <Card
                  key={job.id}
                  className="group relative h-full cursor-pointer"
                >
                  <Link
                    aria-label={`Xem việc làm ${job.title ?? ""}`}
                    className="absolute inset-0 rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    href={`/cong-viec/${job.slug ?? job.id}`}
                  />
                  <CardContent className="pointer-events-none relative flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      <Link
                        className="pointer-events-auto relative z-10 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-xs font-semibold text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
                            {job.title ?? "Chưa cập nhật tiêu đề"}
                          </h3>
                        </div>
                        <Link
                          className="pointer-events-auto relative z-10 mt-0.5 inline-block text-xs text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
                        <ApplyJobButton
                          className="pointer-events-auto relative z-10"
                          job={{
                            id: job.id,
                            title: job.title ?? "Chưa cập nhật tiêu đề",
                            companyName: job.companyName,
                          }}
                        />
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
