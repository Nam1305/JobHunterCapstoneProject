"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { jobApi, useJobPostingDetailQuery } from "@/api/job.api"
import { HtmlInput as HtmlEditorInput } from "@/components/hr/html-input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { ResponseEntity } from "@/types/base"
import type {
  JobPostDetail,
  JobPostingCategory,
  JobPostingOption,
  UpdateJobPostRequest,
} from "@/types/job"

const workTypes = ["Toàn thời gian", "Bán thời gian", "Remote", "Hybrid"]
const jobCategories: JobPostingCategory[] = [
  {
    id: "cat-1",
    name: "Công nghệ thông tin",
    subcategories: [
      { id: "sub-11", name: "C# / .NET" },
      { id: "sub-12", name: "Golang" },
      { id: "sub-13", name: "React / Frontend" },
    ],
  },
  {
    id: "cat-2",
    name: "Kinh doanh & Marketing",
    subcategories: [
      { id: "sub-21", name: "Marketing Mix 7Ps" },
      { id: "sub-22", name: "Business Model Canvas" },
    ],
  },
]
const branches = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"]
const experienceLevels = ["Intern", "Fresher", "Junior", "Middle"]
const workTypeOptions = workTypes.map((name) => ({ id: name, name }))
const branchOptions = branches.map((name) => ({ id: name, name }))
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
    .min(1, "Vui lòng chọn ít nhất một kinh nghiệm"),
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
  experienceLevels: [],
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

function findSubCategoryValue(categoryValue: string, subCategoryValue: string) {
  const category = jobCategories.find(
    (item) => item.id === categoryValue || item.name === categoryValue
  )

  return category
    ? findOptionValue(category.subcategories, subCategoryValue)
    : subCategoryValue
}

function toFormValues(job: JobPostDetail): FormValues {
  const category = findOptionValue(jobCategories, job.category ?? "")

  return {
    title: job.name ?? "",
    salary: job.salaryRange ?? "",
    jobWorkType: job.jobWorkType ?? "",
    expiredDate: toDateInputValue(job.experiedDate),
    category,
    subCategory: findSubCategoryValue(category, job.subCategory ?? ""),
    branch: job.branch ?? "",
    experienceLevels: job.experienceLevels ?? [],
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
    experienceLevels: values.experienceLevels,
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
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full bg-muted/50 px-4 text-base md:text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ExperienceMultiSelect({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean
  onChange: (value: string[]) => void
  value: string[]
}) {
  const [open, setOpen] = useState(false)

  const toggleLevel = (level: string) => {
    if (disabled) {
      return
    }

    onChange(
      value.includes(level)
        ? value.filter((item) => item !== level)
        : [...value, level]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          type="button"
          variant="outline"
          className="h-11 w-full justify-between rounded-xl bg-background px-4 text-left text-base font-normal md:text-sm"
        >
          <span className="truncate">
            {value.length > 0 ? value.join(", ") : "Chọn kinh nghiệm"}
          </span>
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 gap-1 rounded-xl p-2">
        {experienceLevels.map((level) => (
          <label
            key={level}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent"
          >
            <Checkbox
              checked={value.includes(level)}
              disabled={disabled}
              onCheckedChange={() => toggleLevel(level)}
            />
            <span>{level}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const updateJobPostingMutation = useMutation<
    ResponseEntity<JobPostDetail>,
    AxiosError<ResponseEntity<unknown>>,
    FormValues
  >({
    mutationFn: (values) => {
      if (!jobId) {
        throw new Error("Missing job posting id")
      }

      return jobApi.updateJobPosting(jobId, toUpdatePayload(values))
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
      queryClient.invalidateQueries({ queryKey: ["jobPostingDetail", jobId] })

      if (response.data) {
        form.reset(toFormValues(response.data))
      }

      toast.success(response.message || "Cập nhật tin tuyển dụng thành công")
    },
    onError: (error) => {
      const message =
        error.response?.data.message || "Không thể cập nhật tin tuyển dụng"

      form.setError("root", { message })
      toast.error(message)
    },
  })

  useEffect(() => {
    if (isEditMode && jobPostingDetail?.data) {
      form.reset(toFormValues(jobPostingDetail.data))
    }
  }, [form, isEditMode, jobPostingDetail])

  const onSubmit = (values: FormValues) => {
    form.clearErrors("root")

    if (isEditMode) {
      updateJobPostingMutation.mutate(values)
    }
  }

  const isSubmitting = updateJobPostingMutation.isPending
  const isFormDisabled = isJobPostingDetailLoading || isSubmitting
  const selectedCategoryId = form.watch("category")
  const selectedCategory = jobCategories.find(
    (category) => category.id === selectedCategoryId
  )
  const subCategoryOptions =
    selectedCategory?.subcategories ?? emptySubCategoryOptions
  const pageTitle = isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Tạo tin tuyển dụng"
  const pageDescription = isEditMode
    ? "Cập nhật thông tin bài đăng tuyển dụng."
    : "Nhập thông tin để tạo bài đăng tuyển dụng."

  useEffect(() => {
    const currentSubCategory = form.getValues("subCategory")

    if (
      currentSubCategory &&
      !subCategoryOptions.some((option) => option.id === currentSubCategory)
    ) {
      form.setValue("subCategory", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [form, selectedCategoryId, subCategoryOptions])

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
                  <Input
                    disabled={isFormDisabled}
                    className="h-11 bg-muted/50 px-4 text-base md:text-sm"
                    {...field}
                  />
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
                  <Input
                    disabled={isFormDisabled}
                    className="h-11 bg-muted/50 px-4 text-base md:text-sm"
                    {...field}
                  />
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
                    <div className="relative">
                      <CalendarIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        disabled={isFormDisabled}
                        type="date"
                        className="h-11 bg-background pl-11 text-base md:text-sm"
                        {...field}
                      />
                    </div>
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
                    disabled={isFormDisabled}
                    options={jobCategories}
                    placeholder="Chọn danh mục"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      form.setValue("subCategory", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
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
                    disabled={isFormDisabled || !selectedCategoryId}
                    options={subCategoryOptions}
                    placeholder="Chọn danh mục trước"
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
                    disabled={isFormDisabled}
                    options={branchOptions}
                    placeholder="Chọn chi nhánh"
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
                  <FormLabel>Kinh nghiệm làm việc</FormLabel>
                  <ExperienceMultiSelect
                    disabled={isFormDisabled}
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
                    <Input
                      disabled={isFormDisabled}
                      className="h-11 bg-muted/50 px-4 text-base md:text-sm"
                      {...field}
                    />
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
                  <Input
                    disabled={isFormDisabled}
                    className="h-11 bg-background px-4 text-base md:text-sm"
                    {...field}
                  />
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
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Form>
  )
}