import * as z from "zod"
import type {
  JobPostDetail,
  JobPostingCategory as Category,
  JobPostingOption,
  UpdateJobPostRequest,
} from "@/types/job"

export const WORK_TYPES = ["Onsite", "Remote", " Hybrid", "Oversea"]
export const WORK_TYPE_OPTIONS = WORK_TYPES.map((name) => ({ id: name, name }))
export const EMPTY_BRANCH_OPTIONS: JobPostingOption[] = []
export const EMPTY_CATEGORY_OPTIONS: Category[] = []
export const EMPTY_EXPERIENCE_LEVEL_OPTIONS: JobPostingOption[] = []
export const EMPTY_SUB_CATEGORY_OPTIONS: JobPostingOption[] = []

const REQUIRED_MESSAGE = "Vui lòng nhập thông tin này"

export const formSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tên công việc"),
  salary: z.string().trim().min(1, "Vui lòng nhập mức lương"),
  jobWorkType: z.string().trim().min(1, "Vui lòng chọn hình thức làm việc"),
  expiredDate: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn ngày hết hạn")
    .refine((value) => {
      const selectedDate = new Date(`${value}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return selectedDate > today
    }, "Ngày hết hạn phải là ngày trong tương lai"),
  category: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  subCategory: z.string().trim().min(1, "Vui lòng chọn danh mục con"),
  branch: z.string().trim().min(1, "Vui lòng chọn chi nhánh"),
  experienceLevels: z
    .array(z.string())
    .min(1, "Vui lòng chọn cấp độ kinh nghiệm"),
  experienceYears: z.string().trim().min(1, "Vui lòng nhập số năm kinh nghiệm"),
  tags: z.array(z.string()).min(1, "Vui lòng nhập ít nhất một tag"),
  responsibilities: z
    .string()
    .refine((value) => value.trim().length > 0, REQUIRED_MESSAGE),
  requirements: z
    .string()
    .refine((value) => value.trim().length > 0, REQUIRED_MESSAGE),
  benefits: z
    .string()
    .refine((value) => value.trim().length > 0, REQUIRED_MESSAGE),
})

export type FormValues = z.infer<typeof formSchema>

export function getFutureDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return date.toISOString().slice(0, 10)
}

export const DEFAULT_FORM_VALUES: FormValues = {
  title: "",
  salary: "",
  jobWorkType: "",
  expiredDate: getFutureDate(30),
  category: "",
  subCategory: "",
  branch: "",
  experienceLevels: [],
  experienceYears: "",
  tags: [],
  responsibilities: "",
  requirements: "",
  benefits: "",
}

export function toDateInputValue(value: string) {
  return value ? value.slice(0, 10) : ""
}

export function toDateValue(value: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

export function toDateFieldValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function formatDateDisplay(value: string) {
  const date = toDateValue(value)

  return date
    ? new Intl.DateTimeFormat("vi-VN").format(date)
    : "Chọn ngày hết hạn"
}

export function findOptionValue(options: JobPostingOption[], value: string) {
  return (
    options.find((option) => option.id === value || option.name === value)
      ?.id ?? value
  )
}

export function findSubCategoryValue(
  categories: Category[],
  categoryValue: string,
  subCategoryValue: string
) {
  const category = categories.find(
    (item) => item.id === categoryValue || item.name === categoryValue
  )

  return category
    ? findOptionValue(category.subcategories, subCategoryValue)
    : subCategoryValue
}

export function findExperienceLevelValues(
  levels: JobPostingOption[],
  levelValues: string[] | undefined
) {
  return levelValues?.map((value) => findOptionValue(levels, value)) ?? []
}

export function normalizeTags(tags: JobPostDetail["tags"] | string | undefined) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean)
  }

  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function toFormValues(
  job: JobPostDetail,
  categories: Category[],
  branches: JobPostingOption[],
  experienceLevels: JobPostingOption[]
): FormValues {
  const category = findOptionValue(categories, job.category ?? "")

  return {
    title: job.name ?? "",
    salary: job.salaryRange ?? "",
    jobWorkType: job.jobWorkType ?? "",
    expiredDate: toDateInputValue(job.experiedDate ?? job.expiredDate ?? ""),
    category,
    subCategory: findSubCategoryValue(
      categories,
      category,
      job.subCategory ?? ""
    ),
    branch: findOptionValue(branches, job.branch ?? ""),
    experienceLevels: findExperienceLevelValues(
      experienceLevels,
      job.experienceLevels
    ),
    experienceYears: job.experienceRequirement ?? "",
    tags: normalizeTags(job.tags),
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
  }
}

export function toUpdatePayload(values: FormValues): UpdateJobPostRequest {
  return {
    name: values.title,
    salaryRange: values.salary,
    jobWorkType: values.jobWorkType,
    experiedDate: values.expiredDate,
    category: values.category,
    subCategory: values.subCategory,
    branch: values.branch,
    experienceLevels: values.experienceLevels,
    experienceRequirement: values.experienceYears,
    tags: values.tags,
    responsibilities: values.responsibilities,
    requirements: values.requirements,
    benefits: values.benefits,
  }
}
