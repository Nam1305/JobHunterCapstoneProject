"use client"

import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { JobPostingCategory, JobPostingOption } from "@/types/job"
import { ExpiredDatePicker } from "./fields/expired-date-picker"
import { FormSection } from "./fields/form-section"
import { HtmlInput } from "./fields/html-input"
import { PostingMultiSelect } from "./fields/posting-multi-select"
import { PostingSelect } from "./fields/posting-select"
import { TagsInput } from "./fields/tags-input"

export const workTypeOptions = ["Onsite", "Remote", "Hybrid", "Oversea"].map(
  (name) => ({ id: name, name })
)

const requiredMessage = "Vui lòng nhập thông tin này"

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
    .refine((value) => value.trim().length > 0, requiredMessage),
  requirements: z
    .string()
    .refine((value) => value.trim().length > 0, requiredMessage),
  benefits: z
    .string()
    .refine((value) => value.trim().length > 0, requiredMessage),
})

export type FormValues = z.infer<typeof formSchema>

function getFutureDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return date.toISOString().slice(0, 10)
}

export const defaultFormValues: FormValues = {
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

const emptyOptions: JobPostingOption[] = []

interface JobPostingFormProps {
  mode: "create" | "edit"
  form: UseFormReturn<FormValues>
  categories: JobPostingCategory[]
  branchOptions: JobPostingOption[]
  experienceLevelOptions: JobPostingOption[]
  isSubmitting?: boolean
  isFormDisabled?: boolean
  onSubmit: (values: FormValues) => void
  onCancel?: () => void
}

export function JobPostingForm({
  mode,
  form,
  categories,
  branchOptions,
  experienceLevelOptions,
  isSubmitting = false,
  isFormDisabled = false,
  onSubmit,
  onCancel,
}: JobPostingFormProps) {
  const isEditMode = mode === "edit"
  const selectedCategoryId = form.watch("category")
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )
  const subCategoryOptions = selectedCategory?.subcategories ?? emptyOptions
  const pageTitle = isEditMode
    ? "Chỉnh sửa tin tuyển dụng"
    : "Tạo tin tuyển dụng"
  const pageDescription = isEditMode
    ? "Cập nhật thông tin bài đăng tuyển dụng."
    : "Nhập thông tin để tạo bài đăng tuyển dụng."
  const submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo tin"
  const rootError = form.formState.errors.root?.message

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

        {rootError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {rootError}
          </p>
        ) : null}

        <FormSection title="Thông tin cơ bản">
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
        </FormSection>

        <FormSection title="Phân loại">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <PostingSelect
                    disabled={isFormDisabled}
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
                  <FormLabel>Cấp độ kinh nghiệm</FormLabel>
                  <PostingMultiSelect
                    disabled={isFormDisabled}
                    options={experienceLevelOptions}
                    placeholder="Chọn cấp độ kinh nghiệm"
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
        </FormSection>

        <FormSection title="Nội dung tuyển dụng">
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
        </FormSection>

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
            disabled={isFormDisabled || isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
