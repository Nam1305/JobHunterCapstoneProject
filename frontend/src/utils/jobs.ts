import type { JobsListQuery } from "@/data/jobs"

export function formatDaysUntil(expiredAt: string | null) {
  if (!expiredAt) return "Chưa cập nhật hạn"

  const diff = new Date(expiredAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))

  return days === 0 ? "Hết hạn hôm nay" : `Còn ${days} ngày`
}

export function getEmptyJobsQuery(): JobsListQuery {
  return {
    search: "",
    location: "",
    companySlug: "",
    categorySlugs: [],
    subcategorySlugs: [],
    levelSlugs: [],
    workTypes: [],
    page: 1,
  }
}
