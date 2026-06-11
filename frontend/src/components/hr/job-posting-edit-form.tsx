"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

const workTypes = ["Onsite", "Remote", " Hybrid", "Oversea"]
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
  experienceLevels: z
    .array(z.string())
    .min(1, "Vui lòng chọn cấp độ kinh nghiệm"),
  experienceYears: z.string().trim().min(1, "Vui lòng nhập số năm kinh nghiệm"),
  tags: z.array(z.string()).min(1, "Vui lòng nhập ít nhất một tag"),
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
  experienceLevels: [],
  experienceYears: "",
  tags: [],
  responsibilities: "",
  requirements: "",
  benefits: "",
}

function toDateInputValue(value: string) {
  return value ? value.slice(0, 10) : ""
}

function toDateValue(value: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function toDateFieldValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDateDisplay(value: string) {
  const date = toDateValue(value)

  return date
    ? new Intl.DateTimeFormat("vi-VN").format(date)
    : "Chọn ngày hết hạn"
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

function findExperienceLevelValues(
  levels: JobPostingOption[],
  levelValues: string[] | undefined
) {
  return levelValues?.map((value) => findOptionValue(levels, value)) ?? []
}

function normalizeTags(tags: JobPostDetail["tags"] | string | undefined) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean)
  }

  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function toFormValues(
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

function toUpdatePayload(values: FormValues): UpdateJobPostRequest {
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

function Section({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Card className="gap-5 py-6">
      <CardHeader className="px-5 pb-0 md:px-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 md:px-6">{children}</CardContent>
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
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
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
  )
}

function PostingMultiSelect({
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: {
  disabled?: boolean
  onChange: (value: string[]) => void
  options: JobPostingOption[]
  placeholder: string
  value: string[]
}) {
  const safeOptions = Array.isArray(options) ? options : []
  const selectedOptions = safeOptions.filter((option) =>
    value.includes(option.id)
  )
  const displayValue =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length <= 2
        ? selectedOptions.map((option) => option.name).join(", ")
        : `${selectedOptions.length} cấp độ đã chọn`

  function handleToggle(optionId: string, checked: boolean) {
    onChange(
      checked
        ? [...value, optionId]
        : value.filter((currentValue) => currentValue !== optionId)
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FormControl>
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
          >
            <span
              className={`min-w-0 flex-1 truncate text-left ${
                selectedOptions.length === 0 ? "text-muted-foreground" : ""
              }`}
            >
              {displayValue}
            </span>
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
          </button>
        </FormControl>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {safeOptions.length === 0 ? (
          <DropdownMenuLabel>Không có dữ liệu</DropdownMenuLabel>
        ) : (
          safeOptions.map((option) => {
            const checked = value.includes(option.id)

            return (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={checked}
                onCheckedChange={(nextChecked) =>
                  handleToggle(option.id, nextChecked === true)
                }
                onSelect={(event) => event.preventDefault()}
              >
                <span className="min-w-0 flex-1 truncate">{option.name}</span>
              </DropdownMenuCheckboxItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ExpiredDatePicker({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean
  onChange: (value: string) => void
  value: string
}) {
  const [open, setOpen] = useState(false)
  const selectedDate = toDateValue(value)

  function isPastOrToday(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date <= today
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled}
          >
            <span
              className={`min-w-0 flex-1 truncate ${
                value ? "" : "text-muted-foreground"
              }`}
            >
              {formatDateDisplay(value)}
            </span>
            <CalendarIcon
              data-icon="inline-end"
              className="text-muted-foreground"
            />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          disabled={isPastOrToday}
          onSelect={(date) => {
            if (!date) {
              return
            }

            onChange(toDateFieldValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function TagsInput({
  disabled,
  onChange,
  placeholder,
  value,
}: {
  disabled?: boolean
  onChange: (value: string[]) => void
  placeholder: string
  value: string[]
}) {
  const [draftTag, setDraftTag] = useState("")

  function addTag() {
    const nextTag = draftTag.trim()

    if (!nextTag) {
      return
    }

    if (!value.includes(nextTag)) {
      onChange([...value, nextTag])
    }

    setDraftTag("")
  }

  function removeTag(tag: string) {
    onChange(value.filter((currentTag) => currentTag !== tag))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== "Tab") {
      return
    }

    if (!draftTag.trim()) {
      return
    }

    event.preventDefault()
    addTag()
  }

  return (
    <div className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50">
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="max-w-full">
          <span className="max-w-48 truncate">{tag}</span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            disabled={disabled}
            aria-label={`Xóa tag ${tag}`}
            onClick={() => removeTag(tag)}
          >
            <XIcon className="size-3.5" />
          </button>
        </Badge>
      ))}
      <input
        disabled={disabled}
        value={draftTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-36 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        onChange={(event) => setDraftTag(event.target.value)}
        onKeyDown={handleKeyDown}
      />
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
    <FormItem className="space-y-2.5">
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
  const optionRefetchOnMount = isEditMode ? "always" : undefined
  const {
    data: categoriesData,
    isFetching: isCategoriesFetching,
    isLoading: isCategoriesLoading,
  } = useCategoriesQuery({ refetchOnMount: optionRefetchOnMount })
  const {
    data: branchOptionsData,
    isFetching: isBranchOptionsFetching,
    isLoading: isBranchOptionsLoading,
  } = useGetBranchOption({ refetchOnMount: optionRefetchOnMount })
  const {
    data: experienceLevelsResponse,
    isFetching: isExperienceLevelsFetching,
    isPending: isExperienceLevelsPending,
  } = useExperienceLevelsQuery({ refetchOnMount: optionRefetchOnMount })
  const areOptionsReady =
    !isCategoriesLoading &&
    !isCategoriesFetching &&
    !isBranchOptionsLoading &&
    !isBranchOptionsFetching &&
    !isExperienceLevelsPending &&
    !isExperienceLevelsFetching
  const canLoadJobPostingDetail =
    isEditMode &&
    Boolean(jobId) &&
    areOptionsReady
  const {
    data: jobPostingDetail,
    error: jobPostingDetailError,
    isLoading: isJobPostingDetailLoading,
  } = useJobPostingDetailQuery(jobId ?? "", canLoadJobPostingDetail)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })
  const initializedJobIdRef = useRef<string | null>(null)

  const createJobPostingMutation = useCreateJobPosting()
  const updateJobPostingMutation = useUpdateJobPosting()

  useEffect(() => {
    if (!isEditMode) {
      initializedJobIdRef.current = null
      return
    }

    if (
      !jobId ||
      !jobPostingDetail?.data ||
      !areOptionsReady
    ) {
      return
    }

    if (initializedJobIdRef.current === jobId) {
      return
    }

    form.reset(
      toFormValues(
        jobPostingDetail.data,
        categoriesData ?? [],
        branchOptionsData ?? [],
        experienceLevelsResponse?.data ?? []
      )
    )
    initializedJobIdRef.current = jobId
  }, [
    branchOptionsData,
    categoriesData,
    experienceLevelsResponse,
    form,
    areOptionsReady,
    isEditMode,
    jobId,
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

            // if (response.data) {
            //   form.reset(
            //     toFormValues(
            //       response.data,
            //       categoriesData ?? [],
            //       branchOptionsData ?? [],
            //       experienceLevelsResponse?.data ?? []
            //     )
            //   )
            //   initializedJobIdRef.current = jobId
            // }

            initializedJobIdRef.current = null;

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

  return (
    <Form {...form}>
      <form
        data-mode={mode}
        className="flex w-full flex-1 flex-col gap-6 p-4 md:gap-7 md:p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-normal">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {pageDescription}
          </p>
        </div>

        {jobPostingDetailError ? (
          <Card>
            <CardContent className="p-5 text-sm text-destructive">
              Không thể tải thông tin tin tuyển dụng. Vui lòng thử lại sau.
            </CardContent>
          </Card>
        ) : null}

        {form.formState.errors.root?.message ? (
          <Card>
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

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
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
                  <ExpiredDatePicker
                    disabled={isFormDisabled}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section title="Phân loại">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
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
                    key={`${selectedCategoryId}-${subCategoryOptions.length}`}
                    disabled={
                      isFormDisabled ||
                      isCategoriesLoading ||
                      !selectedCategory ||
                      subCategoryOptions.length === 0
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

          <div className="grid gap-5 md:grid-cols-[1fr_1fr_1fr] md:gap-6">
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
              name="experienceLevels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp độ kinh nghiệm</FormLabel>
                  <PostingMultiSelect
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
                  <TagsInput
                    disabled={isFormDisabled}
                    placeholder="Nhập tag rồi nhấn Enter hoặc Tab"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Nhấn Enter hoặc Tab để thêm tag.
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
