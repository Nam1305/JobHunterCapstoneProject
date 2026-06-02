import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContainer } from "@/components/user/user-container"

const companies = [
  {
    name: "Viettel - BankPlus",
    initials: "VB",
    followers: 1,
    jobs: 0,
  },
  {
    name: "Viettel Solutions",
    initials: "VS",
    followers: 122,
    jobs: 3,
  },
  {
    name: "Viettel IDC",
    initials: "VI",
    followers: 43,
    jobs: 0,
  },
  {
    name: "Viettel Cyber Security",
    initials: "VC",
    followers: 87,
    jobs: 2,
  },
  {
    name: "Viettel Post",
    initials: "VP",
    followers: 210,
    jobs: 5,
  },
  {
    name: "Viettel Construction",
    initials: "VC",
    followers: 19,
    jobs: 1,
  },
  {
    name: "Viettel Media",
    initials: "VM",
    followers: 54,
    jobs: 4,
  },
  {
    name: "Viettel Digital Services",
    initials: "VD",
    followers: 336,
    jobs: 8,
  },
  {
    name: "Viettel Telecom",
    initials: "VT",
    followers: 512,
    jobs: 12,
  },
  {
    name: "Viettel High Tech",
    initials: "VH",
    followers: 148,
    jobs: 6,
  },
  {
    name: "Viettel AI",
    initials: "VA",
    followers: 96,
    jobs: 3,
  },
  {
    name: "Viettel Global",
    initials: "VG",
    followers: 271,
    jobs: 7,
  },
  {
    name: "Viettel Network",
    initials: "VN",
    followers: 188,
    jobs: 4,
  },
  {
    name: "Viettel Academy",
    initials: "VA",
    followers: 72,
    jobs: 2,
  },
  {
    name: "Viettel Store",
    initials: "VS",
    followers: 403,
    jobs: 10,
  },
  {
    name: "Viettel Logistics",
    initials: "VL",
    followers: 35,
    jobs: 1,
  },
  {
    name: "Viettel Cloud",
    initials: "VC",
    followers: 164,
    jobs: 5,
  },
]

const visibleCompanies = companies.slice(0, 9)

function CompanyCard({
  company,
}: {
  company: (typeof companies)[number]
}) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex h-36 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
        {company.name}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
            {company.initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold leading-6">
              {company.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {company.followers} người theo dõi
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t pt-3">
          <Button variant="outline" type="button">
            Xem công ty
          </Button>
          <Button variant="outline" type="button">
            Theo dõi
          </Button>
          <span className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground">
            {company.jobs} việc làm
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

export default function CompaniesPage() {
  return (
    <UserContainer className="py-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal">
          Khám phá công ty
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho
          bạn
        </p>

        <div className="mt-7 flex gap-3">
          <Input className="flex-1" defaultValue="viettel" type="search" />
          <Button type="button">Tìm</Button>
        </div>
      </header>

      <div className="my-9 border-t" />

      <section>
        <h2 className="text-xl font-semibold tracking-normal">
          Tất cả công ty{" "}
          <span className="font-normal text-muted-foreground">
            ({companies.length})
          </span>
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleCompanies.map((company) => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>
      </section>

      <footer className="mt-9 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Hiển thị 1-9 trong {companies.length} công ty</p>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Trang trước"
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button aria-current="page" size="icon" type="button">
            1
          </Button>
          <Button size="icon" type="button" variant="ghost">
            2
          </Button>
          <Button
            aria-label="Trang sau"
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </footer>
    </UserContainer>
  )
}
