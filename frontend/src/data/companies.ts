import "server-only";
import type { PageResult, ResponseEntity } from "@/types/base";
import type {
  Company,
  CompanyCard as CompanyCardData,
} from "@/types/company";

const API_BASE_URL = process.env.API_BASE_URL
export const COMPANY_PAGE_SIZE = 9

const emptyCompaniesResult = (
  page: number
): PageResult<CompanyCardData> => ({
  items: [],
  page,
  pageSize: COMPANY_PAGE_SIZE,
  totalCount: 0,
  totalPage: 1,
})

export async function getTopCompanies(): Promise<CompanyCardData[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/top?limit=9`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return []
    }

    const payload = (await response.json()) as ResponseEntity<CompanyCardData[]>

    return payload.data ?? []
  } catch {
    return []
  }
}

export async function getCompanies({
  page,
  search,
}: {
  page: number
  search: string
}): Promise<PageResult<CompanyCardData>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(COMPANY_PAGE_SIZE),
  })

  if (search) params.set("search", search)

  try {
    const response = await fetch(`${API_BASE_URL}/companies?${params}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return emptyCompaniesResult(page)
    }

    const payload =
      (await response.json()) as ResponseEntity<PageResult<CompanyCardData>>

    return payload.success && payload.data
      ? payload.data
      : emptyCompaniesResult(page)
  } catch {
    return emptyCompaniesResult(page)
  }
}

export async function getCompanyBySlug(
  slug: string
): Promise<Company | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/companies/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as ResponseEntity<Company>

    return payload.success ? payload.data : null
  } catch {
    return null
  }
}
