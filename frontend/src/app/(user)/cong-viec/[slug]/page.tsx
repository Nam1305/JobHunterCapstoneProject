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

const job = {
  title: "Content Marketing",
  salary: "9.000.000 VND - 13.000.000 VND",
  location: "Quận Bình Thạnh, Hồ Chí Minh",
  levels: "Junior, Middle, Senior",
  experience: "1 năm, 3 năm",
  daysLeft: "Còn 11 ngày",
  applicants: "58 ứng viên",
  skills: [
    "Viết nội dung",
    "SEO",
    "Canva",
    "CapCut",
    "Mạng xã hội",
    "Viết quảng cáo",
    "Quảng cáo TikTok",
    "Phân tích dữ liệu",
  ],
  sections: [
    {
      title: "TRÁCH NHIỆM",
      icon: Sparkles,
      items: [
        "Lập kế hoạch, xây dựng và quản lý lịch nội dung cho các nền tảng mạng xã hội như Facebook, LinkedIn, TikTok.",
        "Viết bài blog hấp dẫn, thân thiện với SEO nhằm tăng lưu lượng truy cập tự nhiên và mang lại giá trị cho người đọc.",
        "Xây dựng kịch bản và chỉnh sửa cơ bản cho video ngắn trên TikTok, Reels, Shorts để tăng mức độ tương tác với thương hiệu.",
        "Viết nội dung rõ ràng, thuyết phục cho quảng cáo số và bài đăng hằng ngày, phù hợp với giọng điệu thương hiệu.",
        "Theo dõi xu hướng mạng xã hội và phản hồi từ người dùng để cải thiện hiệu quả nội dung và tăng trưởng người theo dõi.",
        "Phối hợp chặt chẽ với Designer để sản xuất nội dung hình ảnh hỗ trợ các chiến dịch tiếp thị.",
      ],
    },
    {
      title: "YÊU CẦU",
      icon: ClipboardCheck,
      items: [
        "Có 1-3 năm kinh nghiệm trong tiếp thị nội dung, quản lý mạng xã hội hoặc viết quảng cáo.",
        "Kỹ năng viết tốt, có khả năng điều chỉnh giọng văn và phong cách cho từng nền tảng.",
        "Biết sử dụng các công cụ như CapCut, Canva hoặc ứng dụng chỉnh sửa trên điện thoại để tạo video mạng xã hội.",
        "Có hiểu biết cơ bản về SEO và cách viết bài blog đạt hiệu quả trên công cụ tìm kiếm.",
        "Sáng tạo, chú ý đến chi tiết và có khả năng đề xuất các ý tưởng nội dung thu hút.",
      ],
    },
    {
      title: "PHÚC LỢI",
      icon: Gift,
      items: [
        "Mức lương cạnh tranh cùng thưởng hiệu suất theo quý.",
        "Lương tháng 13 và đầy đủ bảo hiểm xã hội theo quy định pháp luật Việt Nam.",
        "Thời gian làm việc linh hoạt với 2 ngày làm việc từ xa mỗi tuần.",
        "Du lịch công ty hằng năm và ngân sách cho hoạt động gắn kết đội nhóm.",
        "Lộ trình phát triển rõ ràng cùng ngân sách học tập và phát triển chuyên môn.",
      ],
    },
  ],
}

const company = {
  initials: "DK",
  name: "DaouKiwoom Innovation",
  industries: "Tài chính, Tuyển dụng, Webtoon",
  size: "100-499 nhân viên",
  country: "Hàn Quốc",
  openJobs: 12,
}

const companyJobs = [
  {
    initials: "DK",
    title: "Product Owner kiêm BA",
    salary: "Lên tới 25.000.000 VND",
    tags: ["Product Owner", "Phân tích nghiệp vụ"],
  },
  {
    initials: "DK",
    title: "Lập trình viên Web Front-end",
    salary: "Lên tới 40.000.000 VND",
    tags: ["HTML5", "JavaScript", "ReactJS", "+2"],
  },
  {
    initials: "DK",
    title: "Lập trình viên Server C",
    salary: "45.000.000VND",
    tags: ["Agile", "Git", "Ngôn ngữ C"],
  },
]

const similarJobs = [
  {
    initials: "FP",
    title: "Lập trình viên Frontend Senior",
    company: "FPT Software",
    salary: "25 - 40 triệu VND",
    tags: ["ReactJS", "TypeScript"],
  },
  {
    initials: "VN",
    title: "Kỹ sư Backend NodeJS",
    company: "VNG Corporation",
    salary: "30 - 50 triệu VND",
    tags: ["NodeJS", "MongoDB"],
  },
  {
    initials: "SH",
    title: "Chuyên viên thiết kế UI/UX",
    company: "Shopee Vietnam",
    salary: "20 - 35 triệu VND",
    tags: ["Figma", "Design System"],
  },
  {
    initials: "TI",
    title: "Kỹ sư dữ liệu",
    company: "Tiki",
    salary: "28 - 45 triệu VND",
    tags: ["Python", "BigQuery"],
  },
  {
    initials: "MO",
    title: "Quản lý sản phẩm",
    company: "MOMO",
    salary: "35 - 60 triệu VND",
    tags: ["Fintech", "Agile"],
  },
]

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
                  <span className="font-medium text-foreground">{job.salary}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 shrink-0" />
                  {job.levels}
                </span>
                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness className="size-3.5 shrink-0" />
                  {job.experience}
                </span>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                {job.daysLeft}
                <span className="px-2" aria-hidden="true">•</span>
                {job.applicants}
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
              {job.sections.map((section, index) => (
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
                  {job.skills.map((skill) => (
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
                  <SimilarJobRow key={similarJob.title} job={similarJob} />
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
      <div className="relative h-[72px] border-b bg-muted">
        <BriefcaseIcon className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
        <div className="absolute -bottom-5 left-4 flex size-10 items-center justify-center rounded-md border bg-card text-xs font-semibold">
          {company.initials}
        </div>
      </div>

      <CardContent className="px-4 pb-3 pt-7">
        <h2 className="text-sm font-semibold leading-5">{company.name}</h2>

        <dl className="mt-3 text-xs">
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Ngành nghề</dt>
            {/* dropped font-medium — text-xs doesn't need it */}
            <dd>{company.industries}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quy mô</dt>
            <dd>{company.size}</dd>
          </div>
          <Separator />
          <div className="grid grid-cols-[5rem_1fr] gap-2 py-2">
            <dt className="text-muted-foreground">Quốc gia</dt>
            <dd>{company.country}</dd>
          </div>
        </dl>
      </CardContent>

      <Separator />

      <div className="flex items-center px-4 py-[10px] text-xs text-muted-foreground">
        <BriefcaseIcon className="mr-1.5 size-3.5 shrink-0" />
        <span>
          <span className="font-semibold text-foreground">{company.openJobs}</span>
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
            <div key={job.title}>
              <div className="grid grid-cols-[2rem_1fr_auto] gap-3">
                <div className="flex size-8 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                  {job.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5">
                    {job.title}
                  </h3>
                  {/* dropped font-medium — salary at text-xs is fine plain */}
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <WalletCards className="size-3 shrink-0" />
                    {job.salary}
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
  job: {
    initials: string
    title: string
    company: string
    salary: string
    tags: string[]
  }
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="grid gap-4 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
        <div className="flex size-12 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
          {job.initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3 sm:block">
            <div>
              <h3 className="font-medium leading-5">{job.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {job.company}
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
            {job.salary}
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