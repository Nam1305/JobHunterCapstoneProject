import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const featuredJobs = [
  {
    title: "Frontend Developer",
    company: "Công ty Sao Việt",
    location: "Thành phố Hồ Chí Minh",
    salary: "18-28 triệu",
  },
  {
    title: "Chuyên viên Nhân sự",
    company: "An Phát Group",
    location: "Hà Nội",
    salary: "12-18 triệu",
  },
  {
    title: "Data Analyst",
    company: "Mekong Digital",
    location: "Đà Nẵng",
    salary: "20-32 triệu",
  },
]

export default function UserHomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="outline" className="gap-1">
            <Sparkles />
            Nền tảng tìm việc thông minh
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Tìm công việc phù hợp với kỹ năng và mục tiêu của bạn
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Khám phá cơ hội nghề nghiệp mới, lưu tin tuyển dụng yêu thích và
              chuẩn bị hồ sơ ứng tuyển trong một nơi duy nhất.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              <Search />
              Tìm việc ngay
            </Button>
            <Button size="lg" variant="outline">
              Tạo hồ sơ
              <ArrowRight />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gợi ý hôm nay</CardTitle>
            <CardDescription>
              Một vài vị trí mẫu dành cho ứng viên mới bắt đầu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredJobs.map((job) => (
              <div
                key={`${job.company}-${job.title}`}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-medium">{job.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <Badge variant="secondary">{job.salary}</Badge>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {job.location}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["1.240+", "Tin tuyển dụng đang mở"],
          ["320+", "Công ty đã xác thực"],
          ["15 phút", "Thời gian tạo hồ sơ mẫu"],
        ].map(([value, label]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle className="text-2xl">{value}</CardTitle>
              <CardDescription>{label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
