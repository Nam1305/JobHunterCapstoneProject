"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type PaginationItem = number | "start-ellipsis" | "end-ellipsis"

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

export function CompanyPagination({
  currentPage,
  paginationItems,
  search,
  totalPages,
}: {
  currentPage: number
  paginationItems: PaginationItem[]
  search: string
  totalPages: number
}) {
  const router = useRouter()

  const goToPage = (page: number) => {
    if (page === currentPage) return

    router.push(getCompanyHref({ page, search }), { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Trang trước"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        size="icon"
        type="button"
        variant="outline"
      >
        <ChevronLeft className="size-5" />
      </Button>
      {paginationItems.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            aria-current={currentPage === item ? "page" : undefined}
            onClick={() => goToPage(item)}
            size="icon"
            type="button"
            variant={currentPage === item ? "default" : "ghost"}
          >
            {item}
          </Button>
        ) : (
          <span
            key={item}
            className="flex size-9 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        )
      )}
      <Button
        aria-label="Trang sau"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        size="icon"
        type="button"
        variant="outline"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  )
}
