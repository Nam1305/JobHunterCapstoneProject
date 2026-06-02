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

const companies = [
  {
    name: "FPT Software",
    field: "Technology",
    jobs: 127,
    mark: "FPT",
  },
  {
    name: "VNG Corporation",
    field: "Gaming",
    jobs: 89,
    mark: "VNG",
  },
  {
    name: "Shopee Vietnam",
    field: "E-commerce",
    jobs: 156,
    mark: "SP",
  },
  {
    name: "Tiki",
    field: "E-commerce",
    jobs: 73,
    mark: "TK",
  },
  {
    name: "MOMO",
    field: "Fintech",
    jobs: 94,
    mark: "MM",
  },
  {
    name: "ViettelPay",
    field: "Fintech",
    jobs: 68,
    mark: "VT",
  },
]

const jobs = [
  {
    title: "Senior Frontend Developer",
    company: "FPT Software",
    salary: "25 - 40 triệu",
    location: "Hà Nội",
    level: "Trưởng phòng",
    type: "Fulltime",
    exp: "5 năm",
    posted: "2 ngày trước",
    hot: true,
    iconClass: "bg-blue-600",
  },
  {
    title: "Backend Engineer (NodeJS)",
    company: "VNG Corporation",
    salary: "30 - 50 triệu",
    location: "TP.HCM",
    level: "Senior",
    type: "Fulltime",
    exp: "4 năm",
    posted: "1 tuần trước",
    hot: true,
    iconClass: "bg-violet-600",
  },
  {
    title: "UI/UX Designer",
    company: "Shopee Vietnam",
    salary: "Thương lượng",
    location: "TP.HCM",
    level: "Middle",
    type: "Fulltime",
    exp: "3 năm",
    posted: "3 ngày trước",
    hot: false,
    iconClass: "bg-amber-500",
  },
  {
    title: "Data Engineer",
    company: "Tiki",
    salary: "28 - 45 triệu",
    location: "Hà Nội",
    level: "Senior",
    type: "Fulltime",
    exp: "4 năm",
    posted: "5 ngày trước",
    hot: true,
    iconClass: "bg-sky-600",
  },
  {
    title: "Product Manager",
    company: "MOMO",
    salary: "35 - 60 triệu",
    location: "TP.HCM",
    level: "Trưởng phòng",
    type: "Fulltime",
    exp: "6 năm",
    posted: "1 tuần trước",
    hot: false,
    iconClass: "bg-fuchsia-500",
  },
  {
    title: "DevOps Engineer",
    company: "ViettelPay",
    salary: "30 - 50 triệu",
    location: "Hà Nội",
    level: "Senior",
    type: "Fulltime",
    exp: "5 năm",
    posted: "2 ngày trước",
    hot: true,
    iconClass: "bg-red-600",
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

function ViewAllLink() {
  return (
    <Button variant="ghost" asChild>
      <a href="#">
        Xem tất cả
        <ChevronRight />
      </a>
    </Button>
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
              <Button size="lg" className="w-full sm:w-auto">
                Tìm kiếm
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
            <ViewAllLink />
          </div>

          <Carousel
            className="mt-10"
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="py-1">
              {companies.map((company) => (
                <CarouselItem
                  key={company.name}
                  className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <Card size="sm" className="h-full">
                    <CardContent className="space-y-4">
                      <div className="flex size-14 items-center justify-center rounded-lg border bg-muted text-xs font-semibold text-muted-foreground">
                        {company.mark}
                      </div>
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {company.field}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BriefcaseBusiness className="size-4" />
                        {company.jobs} vị trí
                      </p>
                    </CardContent>
                  </Card>
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
            <ViewAllLink />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={`${job.company}-${job.title}`}>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                      <span className={`size-4 rounded-full ${job.iconClass}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold leading-5 text-foreground">
                          {job.title}
                        </h3>
                        {job.hot ? <Badge variant="secondary">HOT</Badge> : null}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">  {/* ← sm→xs, mt-1→mt-0.5 */}
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">  {/* ← mt-5→mt-3, gap-x-6→gap-x-4, gap-y-3→gap-y-2, text-sm→text-xs */}
                    <p className="col-span-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">  {/* ← gap-2→gap-1.5, added text-sm to keep salary readable */}
                      <WalletCards className="size-3.5" />  {/* ← size-4→size-3.5 */}
                      {job.salary}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3" />  {/* ← size-4→size-3 */}
                      {job.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <ChartBar className="size-3" />
                      {job.level}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="size-3" />
                      {job.type}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="size-3" />
                      {job.exp}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-3">  {/* ← mt-5→mt-3, pt-4→pt-3 */}
                    <p className="text-xs text-muted-foreground">
                      {job.posted}
                    </p>
                    <div className="flex items-center gap-3">
                      <Button aria-label="Lưu việc làm" size="icon-sm" variant="ghost">
                        <Heart />
                      </Button>
                      <Button>Ứng tuyển</Button>
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
