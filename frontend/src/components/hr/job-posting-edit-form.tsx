"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  useCategoriesQuery,
  useCreateJobPosting,
  useExperienceLevelsQuery,
  useJobPostingDetailQuery,
  useUpdateJobPosting,
} from "@/api/hrjob.api"
import { useGetBranchOption } from "@/api/hrbranch.api"
import { HtmlInput as HtmlEditorInput } from "@/components/hr/html-input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  JobPostDetail,
  JobPostingCategory as Category,
  JobPostingOption,
  UpdateJobPostRequest,
} from "@/types/job"

const workTypes = ["Toàn thời gian", "Bán thời gian", "Remote", "Hybrid"]
const workTypeOptions = workTypes.map((name) => ({ id: name, name }))
const emptyBranchOptions: JobPostingOption[] = []
const emptyCategoryOptions: Category[] = []
const emptyExperienceLevelOptions: JobPostingOption[] = []
const emptySubCategoryOptions: JobPostingOption[] = []

const requiredMessage = "Vui lòng nhập thông tin này"

const formSchema = z.object({
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
  experienceLevel: z.string().trim().min(1, "Vui lòng chọn cấp độ kinh nghiệm"),
  experienceYears: z.string().trim().min(1, "Vui lòng nhập số năm kinh nghiệm"),
  tags: z.string().trim().min(1, "Vui lòng nhập ít nhất một tag"),
  responsibilities: z
    .string()
    .refine((value) => value.trim().length > 0, requiredMessage),
  requirements: z
    .string()
    .refine((value) => value.trim().length > 0, requiredMessage),
  benefits: z
    .string()
    .refine((value) => value.trim().length > 0, requiredMessage),
})

type FormValues = z.infer<typeof formSchema>

function getFutureDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return date.toISOString().slice(0, 10)
}

const defaultFormValues: FormValues = {
  title: "",
  salary: "",
  jobWorkType: "",
  expiredDate: getFutureDate(30),
  category: "",
  subCategory: "",
  branch: "",
  experienceLevel: "",
  experienceYears: "",
  tags: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
}

function toDateInputValue(value: string) {
  return value ? value.slice(0, 10) : ""
}

function findOptionValue(options: JobPostingOption[], value: string) {
  return (
    options.find((option) => option.id === value || option.name === value)
      ?.id ?? value
  )
}

function findSubCategoryValue(
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

function findExperienceLevelValue(
  levels: JobPostingOption[],
  levelValues: string[] | undefined,
  levelName: string | undefined
) {
  const value = levelValues?.[0] ?? levelName?.split(",")[0]?.trim() ?? ""

  return findOptionValue(levels, value)
}

function toFormValues(
  job: JobPostDetail,
  categories: Category[],
  experienceLevels: JobPostingOption[]
): FormValues {
  const category = findOptionValue(categories, job.category ?? "")

  return {
    title: job.name ?? "",
    salary: job.salaryRange ?? "",
    jobWorkType: job.jobWorkType ?? "",
    expiredDate: toDateInputValue(job.experiedDate),
    category,
    subCategory: findSubCategoryValue(
      categories,
      category,
      job.subCategory ?? ""
    ),
    branch: job.branch ?? "",
    experienceLevel: findExperienceLevelValue(
      experienceLevels,
      job.experienceLevels,
      job.level
    ),
    experienceYears: job.experienceReuirement ?? "",
    tags: job.tags ?? "",
    responsibilities: job.reponsibilities ?? "",
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
  }
}

function toUpdatePayload(values: FormValues): UpdateJobPostRequest {
  return {
    name: values.title,
    salaryRange: values.salary,
    jobWorkType: values.jobWorkType,
    experiedDate: values.expiredDate,
    category: values.category,
    subCategory: values.subCategory,
    branch: values.branch,
    experienceLevels: values.experienceLevel ? [values.experienceLevel] : [],
    experienceReuirement: values.experienceYears,
    tags: values.tags,
    reponsibilities: values.responsibilities,
    requirements: values.requirements,
    benefits: values.benefits,
  }
}

function Section({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Card className="gap-4 rounded-xl py-5 shadow-none">
      <CardHeader className="px-5">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-5">{children}</CardContent>
    </Card>
  )
}

function PostingSelect({
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: {
  disabled?: boolean
  onChange: (value: string) => void
  options: JobPostingOption[]
  placeholder: string
  value: string
}) {
  const safeOptions = Array.isArray(options) ? options : []

  return (
    <div className="[&_[data-slot=select-trigger]]:w-full">
      <Select disabled={disabled} value={value} onValueChange={onChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {safeOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function HtmlInput({
  disabled,
  field,
  label,
}: {
  disabled?: boolean
  field: {
    name: string
    onBlur: () => void
    onChange: (value: string) => void
    value: string
  }
  label: string
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <HtmlEditorInput
        disabled={disabled}
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onValueChange={field.onChange}
        textareaWrapper={(textarea) => <FormControl>{textarea}</FormControl>}
      />
      <FormMessage />
    </FormItem>
  )
}

interface JobPostingEditFormProps {
  jobId?: string
  mode?: "create" | "edit"
  onCancel?: () => void
}

export function JobPostingEditForm({
  jobId,
  mode = "edit",
  onCancel,
}: JobPostingEditFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = mode === "edit"
  const {
    data: jobPostingDetail,
    error: jobPostingDetailError,
    isLoading: isJobPostingDetailLoading,
  } = useJobPostingDetailQuery(isEditMode ? jobId ?? "" : "")
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoriesQuery()
  const { data: branchOptionsData, isLoading: isBranchOptionsLoading } =
    useGetBranchOption()
  const {
    data: experienceLevelsResponse,
    isPending: isExperienceLevelsPending,
  } = useExperienceLevelsQuery()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const createJobPostingMutation = useCreateJobPosting()
  const updateJobPostingMutation = useUpdateJobPosting()

  useEffect(() => {
    if (isEditMode && jobPostingDetail?.data) {
      form.reset(
        toFormValues(
          jobPostingDetail.data,
          categoriesData ?? [],
          experienceLevelsResponse?.data ?? []
        )
      )
    }
  }, [
    categoriesData,
    experienceLevelsResponse,
    form,
    isEditMode,
    jobPostingDetail,
  ])

  const onSubmit = (values: FormValues) => {
    form.clearErrors("root")
    const payload = toUpdatePayload(values)

    if (isEditMode) {
      if (!jobId) {
        form.setError("root", { message: "Missing job posting id" })
        return
      }

      updateJobPostingMutation.mutate(
        {
          jobId,
          payload,
        },
        {
          onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
            queryClient.invalidateQueries({
              queryKey: ["jobPostingDetail", jobId],
            })

            if (response.data) {
              form.reset(
                toFormValues(
                  response.data,
                  categoriesData ?? [],
                  experienceLevelsResponse?.data ?? []
                )
              )
            }

            toast.success(
              response.message || "Cập nhật tin tuyển dụng thành công"
            )
          },
          onError: (error) => {
            const message =
              error.response?.data.message ||
              "Không thể cập nhật tin tuyển dụng"

            form.setError("root", { message })
            toast.error(message)
          },
        }
      )

      return
    }

    createJobPostingMutation.mutate(payload, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
        form.reset(defaultFormValues)
        toast.success(response.message || "Tạo tin tuyển dụng thành công")
      },
      onError: (error) => {
        const message =
          error.response?.data.message || "Không thể tạo tin tuyển dụng"

        form.setError("root", { message })
        toast.error(message)
      },
    })
  }

  const isSubmitting =
    createJobPostingMutation.isPending || updateJobPostingMutation.isPending
  const isFormDisabled = isJobPostingDetailLoading || isSubmitting
  const categories = categoriesData ?? emptyCategoryOptions
  const branchOptions = branchOptionsData ?? emptyBranchOptions
  const experienceLevelOptions =
    experienceLevelsResponse?.data ?? emptyExperienceLevelOptions
  const selectedCategoryId = form.watch("category")
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )
  const subCategoryOptions =
    selectedCategory?.subcategories ?? emptySubCategoryOptions
  const pageTitle = isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng"
  const pageDescription = isEditMode
    ? "Cập nhật thông tin bài đăng tuyển dụng."
    : "Nhập thông tin để tạo bài đăng tuyển dụng."
  const submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo tin"

  useEffect(() => {
    const currentSubCategory = form.getValues("subCategory")

    if (
      currentSubCategory &&
      selectedCategory &&
      !subCategoryOptions.some((option) => option.id === currentSubCategory)
    ) {
      form.setValue("subCategory", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [form, selectedCategory, subCategoryOptions])

  return (
    <Form {...form}>
      <form
        data-mode={mode}
        className="flex w-full flex-1 flex-col gap-6 p-4 md:p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-normal">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {pageDescription}
          </p>
        </div>

        {jobPostingDetailError ? (
          <Card className="rounded-xl shadow-none">
            <CardContent className="p-5 text-sm text-destructive">
              Không thể tải thông tin tin tuyển dụng. Vui lòng thử lại sau.
            </CardContent>
          </Card>
        ) : null}

        {form.formState.errors.root?.message ? (
          <Card className="rounded-xl shadow-none">
            <CardContent className="p-5 text-sm text-destructive">
              {form.formState.errors.root.message}
            </CardContent>
          </Card>
        ) : null}

        <Section title="Thông tin cơ bản">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên công việc</FormLabel>
                <FormControl>
                  <Input disabled={isFormDisabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức lương</FormLabel>
                <FormControl>
                  <Input disabled={isFormDisabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobWorkType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình thức làm việc</FormLabel>
                  <PostingSelect
                    disabled={isFormDisabled}
                    options={workTypeOptions}
                    placeholder="Chọn hình thức"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày hết hạn</FormLabel>
                  <FormControl>
                    <Input disabled={isFormDisabled} type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section title="Phân loại">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <PostingSelect
                    disabled={isFormDisabled || isCategoriesLoading}
                    options={categories}
                    placeholder="Chọn danh mục"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      form.setValue("subCategory", "")
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục con</FormLabel>
                  <PostingSelect
                    disabled={
                      isFormDisabled || isCategoriesLoading || !selectedCategory
                    }
                    options={subCategoryOptions}
                    placeholder={
                      selectedCategoryId
                        ? "Chọn danh mục con..."
                        : "Vui lòng chọn danh mục chính"
                    }
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_1fr_1fr]">
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi nhánh</FormLabel>
                  <PostingSelect
                    disabled={isFormDisabled || isBranchOptionsLoading}
                    options={branchOptions}
                    placeholder={
                      isBranchOptionsLoading
                        ? "Đang tải dữ liệu..."
                        : "Chọn chi nhánh"
                    }
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp độ kinh nghiệm</FormLabel>
                  <PostingSelect
                    disabled={isFormDisabled || isExperienceLevelsPending}
                    options={experienceLevelOptions}
                    placeholder={
                      isExperienceLevelsPending
                        ? "Đang tải dữ liệu..."
                        : "Chọn cấp độ kinh nghiệm"
                    }
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số năm kinh nghiệm</FormLabel>
                  <FormControl>
                    <Input disabled={isFormDisabled} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input disabled={isFormDisabled} {...field} />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Nhấn Enter hoặc dấu phẩy để thêm tag.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>

        <Section title="Nội dung tuyển dụng">
          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <HtmlInput
                disabled={isFormDisabled}
                field={field}
                label="Trách nhiệm công việc"
              />
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <HtmlInput
                disabled={isFormDisabled}
                field={field}
                label="Yêu cầu ứng viên"
              />
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <HtmlInput
                disabled={isFormDisabled}
                field={field}
                label="Quyền lợi"
              />
            )}
          />
        </Section>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-24"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="lg"
            className="min-w-36"
            disabled={isFormDisabled || Boolean(jobPostingDetailError)}
          >
            {isSubmitting ? "Đang lưu..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
