import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Form from "next/form"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContainer } from "@/components/user/user-container"
import { getImageUrl } from "@/lib/utils"
import type { PageResult, ResponseEntity } from "@/types/base"
import type { CompanyCard as CompanyCardData } from "@/types/company"

const API_BASE_URL = "http://localhost:5000/api"
const PAGE_SIZE = 9

type CompaniesSearchParams = Promise<{
  search?: string | string[]
  page?: string | string[]
}>

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getCompanyMark(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function getCompanyHref({
  page,
  search,
}: {
  page: number
  search: string
}) {
  const params = new URLSearchParams()

  if (search) params.set("search", search)
  if (page > 1) params.set("page", String(page))

  const query = params.toString()

  return query ? `/cong-ty?${query}` : "/cong-ty"
}

async function getCompanies({
  page,
  search,
}: {
  page: number
  search: string
}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
  })

  if (search) params.set("search", search)

  try {
    const response = await fetch(`${API_BASE_URL}/companies?${params}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        items: [],
        page,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      } satisfies PageResult<CompanyCardData>
    }

    const payload =
      (await response.json()) as ResponseEntity<PageResult<CompanyCardData>>

    return (
      payload.data ?? {
        items: [],
        page,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      }
    )
  } catch {
    return {
      items: [],
      page,
      pageSize: PAGE_SIZE,
      totalCount: 0,
    } satisfies PageResult<CompanyCardData>
  }
}

function CompanyCard({
  company,
}: {
  company: CompanyCardData
}) {
  const coverPhotoUrl = getImageUrl(company.coverPhotoUrl)
  const logoUrl = getImageUrl(company.logoUrl)

  return (
    <article className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex h-36 items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
        {coverPhotoUrl ? (
          <span
            aria-label={`${company.name} cover`}
            className="size-full bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url("${coverPhotoUrl}")` }}
          />
        ) : (
          company.name
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-sm text-muted-foreground">
            {logoUrl ? (
              <span
                aria-label={`${company.name} logo`}
                className="size-full bg-contain bg-center bg-no-repeat"
                role="img"
                style={{ backgroundImage: `url("${logoUrl}")` }}
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
            <dd className="mt-1 text-foreground">
              {company.companyType ?? "Chưa cập nhật"}
            </dd>
          </div>
          <div>
            <dt>Quy mô</dt>
            <dd className="mt-1 text-foreground">
              {company.teamSize ?? "Chưa cập nhật"}
            </dd>
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

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: CompaniesSearchParams
}) {
  const params = await searchParams
  const search = (getParamValue(params.search) ?? "").trim()
  const pageParam = Number(getParamValue(params.page) ?? "1")
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const companies = await getCompanies({ page, search })
  const totalPages = Math.max(1, Math.ceil(companies.totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startItem =
    companies.totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const endItem = Math.min(currentPage * PAGE_SIZE, companies.totalCount)

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

        <Form className="mt-7 flex gap-3" action="/cong-ty">
          <Input
            className="flex-1"
            defaultValue={search}
            name="search"
            placeholder="Nhập tên công ty..."
            type="search"
          />
          <Button type="submit">Tìm</Button>
        </Form>
      </header>

      <div className="my-9 border-t" />

      <section>
        <h2 className="text-xl font-semibold tracking-normal">
          Tất cả công ty{" "}
          <span className="font-normal text-muted-foreground">
            ({companies.totalCount})
          </span>
        </h2>

        {companies.items.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.items.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            Không tìm thấy công ty phù hợp.
          </p>
        )}
      </section>

      <footer className="mt-9 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Hiển thị {startItem}-{endItem} trong {companies.totalCount} công ty
        </p>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Trang trước"
            asChild={currentPage > 1}
            disabled={currentPage <= 1}
            size="icon"
            type="button"
            variant="outline"
          >
            {currentPage > 1 ? (
              <Link
                href={getCompanyHref({ page: currentPage - 1, search })}
              >
                <ChevronLeft className="size-5" />
              </Link>
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </Button>
          <Button aria-current="page" size="icon" type="button">
            {currentPage}
          </Button>
          <Button
            aria-label="Trang sau"
            asChild={currentPage < totalPages}
            disabled={currentPage >= totalPages}
            size="icon"
            type="button"
            variant="outline"
          >
            {currentPage < totalPages ? (
              <Link
                href={getCompanyHref({ page: currentPage + 1, search })}
              >
                <ChevronRight className="size-5" />
              </Link>
            ) : (
              <ChevronRight className="size-5" />
            )}
          </Button>
        </div>
      </footer>
    </UserContainer>
  )
}
