import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContainer } from "@/components/user/user-container"
import type { CompanyCard as CompanyCardData } from "@/types/company"

const companies: CompanyCardData[] = [
  {
    id: "7619c4db-486f-4f46-86aa-35a7d43112ef",
    name: "Viettel - BankPlus",
    slug: "viettel-bankplus",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Fintech",
    teamSize: "500+ nhân sự",
    country: "Vietnam",
    openingVacancies: 0,
    numberOfFollowers: 1,
  },
  {
    id: "aa30a12f-2994-4140-8556-bc07009dad9d",
    name: "Viettel Solutions",
    slug: "viettel-solutions",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Information Technology",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 3,
    numberOfFollowers: 122,
  },
  {
    id: "d00cd5d4-ecdc-4fe2-9340-8eebfcb1ef5a",
    name: "Viettel IDC",
    slug: "viettel-idc",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Data Center",
    teamSize: "300+ nhân sự",
    country: "Vietnam",
    openingVacancies: 0,
    numberOfFollowers: 43,
  },
  {
    id: "44ae9925-b080-475b-961c-88dbcc4f4f1f",
    name: "Viettel Cyber Security",
    slug: "viettel-cyber-security",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Cyber Security",
    teamSize: "300+ nhân sự",
    country: "Vietnam",
    openingVacancies: 2,
    numberOfFollowers: 87,
  },
  {
    id: "23142b92-c1b7-44ee-973a-d942d41ec780",
    name: "Viettel Post",
    slug: "viettel-post",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Logistics",
    teamSize: "5000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 5,
    numberOfFollowers: 210,
  },
  {
    id: "9e1d0b20-9cdb-4687-ad14-321cfb76cd61",
    name: "Viettel Construction",
    slug: "viettel-construction",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Construction",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 1,
    numberOfFollowers: 19,
  },
  {
    id: "19af50bc-7bb8-4589-a1ff-f57131ad7274",
    name: "Viettel Media",
    slug: "viettel-media",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Media",
    teamSize: "300+ nhân sự",
    country: "Vietnam",
    openingVacancies: 4,
    numberOfFollowers: 54,
  },
  {
    id: "8145ae60-c90f-4a60-85ed-5f489d1f684d",
    name: "Viettel Digital Services",
    slug: "viettel-digital-services",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Digital Services",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 8,
    numberOfFollowers: 336,
  },
  {
    id: "ebc335d2-8222-471e-88d2-0f09a3454a15",
    name: "Viettel Telecom",
    slug: "viettel-telecom",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Telecommunications",
    teamSize: "5000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 12,
    numberOfFollowers: 512,
  },
  {
    id: "8a1a4821-0746-4790-81ac-802e8ba2a853",
    name: "Viettel High Tech",
    slug: "viettel-high-tech",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Research and Development",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 6,
    numberOfFollowers: 148,
  },
  {
    id: "4c7a5abe-432d-4539-a6db-19fdfc35a0d5",
    name: "Viettel AI",
    slug: "viettel-ai",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Artificial Intelligence",
    teamSize: "100+ nhân sự",
    country: "Vietnam",
    openingVacancies: 3,
    numberOfFollowers: 96,
  },
  {
    id: "7405ea03-6de0-4f70-aa45-cbc34d8ade6c",
    name: "Viettel Global",
    slug: "viettel-global",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Telecommunications",
    teamSize: "5000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 7,
    numberOfFollowers: 271,
  },
  {
    id: "b916bef2-0292-4ecb-aab3-8b6d47ab8a49",
    name: "Viettel Network",
    slug: "viettel-network",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Network Infrastructure",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 4,
    numberOfFollowers: 188,
  },
  {
    id: "214cba8b-70fe-4122-b530-f2d6d670f134",
    name: "Viettel Academy",
    slug: "viettel-academy",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Education",
    teamSize: "100+ nhân sự",
    country: "Vietnam",
    openingVacancies: 2,
    numberOfFollowers: 72,
  },
  {
    id: "54eec9ad-7fea-481a-a92a-332ecf4bcf24",
    name: "Viettel Store",
    slug: "viettel-store",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Retail",
    teamSize: "1000+ nhân sự",
    country: "Vietnam",
    openingVacancies: 10,
    numberOfFollowers: 403,
  },
  {
    id: "9f20b7ed-736d-4cdb-936f-d8af74b0eb23",
    name: "Viettel Logistics",
    slug: "viettel-logistics",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Logistics",
    teamSize: "300+ nhân sự",
    country: "Vietnam",
    openingVacancies: 1,
    numberOfFollowers: 35,
  },
  {
    id: "e1b9fdff-ae2e-43e7-8271-11a3185f0475",
    name: "Viettel Cloud",
    slug: "viettel-cloud",
    logoUrl: null,
    coverPhotoUrl: null,
    companyType: "Cloud Services",
    teamSize: "300+ nhân sự",
    country: "Vietnam",
    openingVacancies: 5,
    numberOfFollowers: 164,
  },
]

const visibleCompanies = companies.slice(0, 9)

function getCompanyMark(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function CompanyCard({
  company,
}: {
  company: CompanyCardData
}) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex h-36 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
        {company.coverPhotoUrl ? (
          <span
            aria-label={`${company.name} cover`}
            className="size-full bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url(${company.coverPhotoUrl})` }}
          />
        ) : (
          company.name
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-sm text-muted-foreground">
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
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold leading-6">
              {company.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {company.numberOfFollowers} người theo dõi
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div>
            <dt>Ngành nghề</dt>
            <dd className="mt-1 text-foreground">{company.companyType}</dd>
          </div>
          <div>
            <dt>Quy mô</dt>
            <dd className="mt-1 text-foreground">{company.teamSize}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center gap-3 border-t pt-3">
          <Button asChild variant="outline">
            <Link href={`/cong-ty/${company.slug}`}>Xem công ty</Link>
          </Button>
          <Button variant="outline" type="button">
            Theo dõi
          </Button>
          <span className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground">
            {company.openingVacancies} việc làm
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
            <CompanyCard key={company.id} company={company} />
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
