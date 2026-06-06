"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { HtmlInput as HtmlEditorInput } from "@/components/hr/html-input"

const workTypes = ["Toàn thời gian", "Bán thời gian", "Remote", "Hybrid"]
const categories = ["Công nghệ thông tin", "Marketing", "Kinh doanh", "Thiết kế"]
const subCategories = ["Frontend", "Backend", "Product", "Data"]
const branches = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"]
const experienceLevels = ["Intern", "Fresher", "Junior", "Middle"]

const requiredMessage = "Vui lòng nhập thông tin này"

const formSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tên công việc"),
  salary: z.string().trim().min(1, "Vui lòng nhập mức lương"),
  workType: z.string().trim().min(1, "Vui lòng chọn hình thức làm việc"),
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
  onChange,
  options,
  placeholder,
  value,
}: {
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  value: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full bg-muted/50 px-4 text-base md:text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ExperienceMultiSelect({
  onChange,
  value,
}: {
  onChange: (value: string[]) => void
  value: string[]
}) {
  const [open, setOpen] = useState(false)

  const toggleLevel = (level: string) => {
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
  field,
  label,
}: {
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
  mode?: "create" | "edit"
  onCancel?: () => void
}

export function JobPostingEditForm({
  mode = "edit",
  onCancel,
}: JobPostingEditFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Senior Frontend Developer",
      salary: "20,000,000 - 35,000,000 VNĐ",
      workType: "Hybrid",
      expiredDate: getFutureDate(30),
      category: "Công nghệ thông tin",
      subCategory: "Frontend",
      branch: "Hồ Chí Minh",
      experienceLevels,
      experienceYears: "2 năm",
      tags: "React, TypeScript, Next.js, Tailwind CSS",
      responsibilities: `<ul>
  <li>Phát triển giao diện tuyển dụng bằng React và Next.js.</li>
  <li>Phối hợp với Product và Backend để hoàn thiện luồng ứng viên.</li>
  <li>Tối ưu hiệu năng, khả năng truy cập và trải nghiệm người dùng.</li>
</ul>`,
      requirements: `<ul>
  <li>Có từ 2 năm kinh nghiệm phát triển frontend.</li>
  <li>Thành thạo TypeScript, React hooks và quản lý state.</li>
  <li>Có tư duy sản phẩm và khả năng làm việc với thiết kế.</li>
</ul>`,
      benefits: `<ul>
  <li>Lương cạnh tranh theo năng lực và đánh giá định kỳ.</li>
  <li>Môi trường làm việc linh hoạt, hỗ trợ học tập.</li>
  <li>Bảo hiểm, nghỉ phép và ngân sách phát triển cá nhân.</li>
</ul>`,
    },
  })

  const onSubmit = () => {
    form.clearErrors("root")
  }

  return (
    <Form {...form}>
      <form
        data-mode={mode}
        className="flex w-full flex-1 flex-col gap-6 p-4 md:p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-normal">
            Chỉnh sửa tin tuyển dụng
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Cập nhật thông tin bài đăng tuyển dụng.
          </p>
        </div>

        <Section title="Thông tin cơ bản">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên công việc</FormLabel>
                <FormControl>
                  <Input
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
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình thức làm việc</FormLabel>
                  <PostingSelect
                    options={workTypes}
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
                    options={categories}
                    placeholder="Chọn danh mục"
                    value={field.value}
                    onChange={field.onChange}
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
                    options={subCategories}
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
                    options={branches}
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
              <HtmlInput field={field} label="Trách nhiệm công việc" />
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <HtmlInput field={field} label="Yêu cầu ứng viên" />
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <HtmlInput field={field} label="Quyền lợi" />
            )}
          />
        </Section>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-24"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button type="submit" size="lg" className="min-w-36">
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Form>
  )
}
