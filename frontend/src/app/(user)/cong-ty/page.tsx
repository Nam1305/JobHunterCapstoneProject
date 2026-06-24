import { ArrowRight } from "lucide-react"
import Form from "next/form"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContainer } from "@/components/user/user-container"
import { COMPANY_PAGE_SIZE, getCompanies } from "@/data/companies"
import { getImageUrl } from "@/lib/utils"
import type { CompanyCard as CompanyCardData } from "@/types/company"

import { CompanyFollowButton } from "./company-follow-button"
import { CompanyPagination } from "./company-pagination"

type CompaniesSearchParams = Promise<{
  search?: string | string[]
  page?: string | string[]
}>

type PaginationItem = number | "start-ellipsis" | "end-ellipsis"

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

function getPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "start-ellipsis", currentPage, "end-ellipsis", totalPages]
}

function CompanyCard({
  company,
  companyIds,
}: {
  company: CompanyCardData
  companyIds: string[]
}) {
  const coverPhotoUrl = getImageUrl(company.coverPhotoUrl)
  const logoUrl = getImageUrl(company.logoUrl)

  return (
    <article className="relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors hover:border-primary/40">
      <Link
        aria-label={`Xem công ty ${company.name}`}
        className="absolute inset-0 z-10"
        href={`/cong-ty/${company.slug}`}
      />

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
          <CompanyFollowButton
            className="relative z-20"
            companyId={company.id}
            companyIds={companyIds}
            stopPropagation
            variant="outline"
          />
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
  const totalPages = Math.max(
    1,
    companies.totalPage ||
    Math.ceil(companies.totalCount / COMPANY_PAGE_SIZE)
  )
  const currentPage = Math.min(page, totalPages)
  const startItem =
    companies.totalCount === 0
      ? 0
      : (currentPage - 1) * COMPANY_PAGE_SIZE + 1
  const endItem = Math.min(
    currentPage * COMPANY_PAGE_SIZE,
    companies.totalCount
  )
  const companyIds = companies.items.map((company) => company.id)
  const paginationItems = getPaginationItems(currentPage, totalPages)

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
              <CompanyCard
                key={company.id}
                company={company}
                companyIds={companyIds}
              />
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

        <CompanyPagination
          currentPage={currentPage}
          paginationItems={paginationItems}
          search={search}
          totalPages={totalPages}
        />
      </footer>
    </UserContainer>
  )
}
