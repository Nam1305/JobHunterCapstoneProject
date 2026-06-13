"use client"

import { useJobPostingForm } from "@/app/hr/dang-tin-tuyen-dung/_hooks/use-job-posting-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormSection } from "./fields/form-section"
import { PostingSelect } from "./fields/posting-select"
import { PostingMultiSelect } from "./fields/posting-multi-select"
import { ExpiredDatePicker } from "./fields/expired-date-picker"
import { TagsInput } from "./fields/tags-input"
import { HtmlInput } from "./fields/html-input"
import { WORK_TYPE_OPTIONS } from "./job-posting-form-schema"

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
  const {
    form,
    isFormDisabled,
    isCategoriesLoading,
    isBranchOptionsLoading,
    isExperienceLevelsPending,
    jobPostingDetailError,
    isSubmitting,
    categories,
    branchOptions,
    experienceLevelOptions,
    subCategoryOptions,
    selectedCategoryId,
    selectedCategory,
    onSubmit,
    pageTitle,
    pageDescription,
    submitLabel,
  } = useJobPostingForm({ jobId, mode })

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
                    options={WORK_TYPE_OPTIONS}
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
            disabled={isFormDisabled || Boolean(jobPostingDetailError)}
          >
            {isSubmitting ? "Đang lưu..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
