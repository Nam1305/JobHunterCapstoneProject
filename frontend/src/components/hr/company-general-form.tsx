"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, UploadIcon } from "lucide-react"
import {
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  useGetCompanyGeneral,
  useUpdateCompanyCover,
  useUpdateCompanyGeneral,
  useUpdateCompanyLogo,
} from "@/api/hrcompany.api"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COMPANY_GENERAL_QUERY_KEY = ["companyGeneral"]

const companyGeneralFormSchema = z.object({
  name: z.string(),
  websiteUrl: z.string(),
  teamSize: z.string(),
  country: z.string(),
  companyType: z.string(),
})

type CompanyGeneralFormValues = z.infer<typeof companyGeneralFormSchema>

const defaultCompanyGeneralFormValues: CompanyGeneralFormValues = {
  name: "",
  websiteUrl: "",
  teamSize: "",
  country: "",
  companyType: "",
}

const companySizes = [
  "1-100 nhân sự",
  "100 - 1000 nhân sự",
  "1000 - 5000 nhân sự",
  "5000+ nhân sự",
]

const companyTypes = [
  "Công nghệ thông tin",
  "Tài chính - ngân hàng",
  "Giáo dục",
  "Y tế",
  "Sản xuất",
]

const countries = ["Việt Nam", "Singapore", "Thái Lan", "Nhật Bản", "Hoa Kỳ"]

const fallbackImages = {
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80",
  cover:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
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

function ImageUploadField({
  title,
  hint,
  imageSrc,
  imageAlt,
  className,
  disabled,
  isLoading,
  isUploading,
  onFileChange,
}: {
  title: string
  hint: string
  imageSrc: string
  imageAlt: string
  className?: string
  disabled?: boolean
  isLoading?: boolean
  isUploading?: boolean
  onFileChange: (file: File) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDisabled = disabled || isLoading || isUploading

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      onFileChange(selectedFile)
    }

    event.target.value = ""
  }

  return (
    <div className="space-y-2.5">
      <div className="space-y-1.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        aria-label={`Thay ${title.toLowerCase()}`}
        disabled={isDisabled}
        className={[
          "group relative flex min-h-44 w-full overflow-hidden rounded-lg border border-dashed border-border bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center bg-muted/60">
            <Loader2Icon className="size-6 animate-spin" />
          </span>
        ) : (
          <>
            <span
              aria-label={imageAlt}
              role="img"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
            <span className="absolute inset-0 bg-background/10 transition-colors group-hover:bg-background/25" />
          </>
        )}
        <span className="relative m-auto flex items-center gap-2 rounded-md border bg-background/90 px-3 py-2 shadow-sm">
          {isLoading || isUploading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadIcon className="size-4" />
          )}
          {isLoading ? "Đang tải" : "Thay ảnh"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isDisabled}
        onChange={handleFileChange}
      />
    </div>
  )
}

export function CompanyGeneralInformationForm() {
  const queryClient = useQueryClient()
  const { data: companyGeneralResponse, isLoading: isCompanyGeneralLoading } =
    useGetCompanyGeneral()
  const updateCompanyGeneral = useUpdateCompanyGeneral()
  const updateCompanyLogo = useUpdateCompanyLogo()
  const updateCompanyCover = useUpdateCompanyCover()
  const companyGeneral = companyGeneralResponse?.data
  const isTextFormLoading =
    isCompanyGeneralLoading || updateCompanyGeneral.isPending
  const isUploadingLogo = updateCompanyLogo.isPending
  const isUploadingCover = updateCompanyCover.isPending
  const isMediaLoading =
    isCompanyGeneralLoading || isUploadingLogo || isUploadingCover
  const companyGeneralFormValues: CompanyGeneralFormValues = {
    name: companyGeneral?.name ?? "",
    websiteUrl: companyGeneral?.websiteUrl ?? "",
    teamSize: companyGeneral?.teamSize ?? "",
    country: companyGeneral?.country ?? "",
    companyType: companyGeneral?.companyType ?? "",
  }
  const form = useForm<CompanyGeneralFormValues>({
    resolver: zodResolver(companyGeneralFormSchema),
    defaultValues: defaultCompanyGeneralFormValues,
    values: companyGeneralFormValues,
  })

  async function handleSubmit(values: CompanyGeneralFormValues) {
    form.clearErrors("root")

    try {
      await updateCompanyGeneral.mutateAsync({
        companyData: values,
      })
      toast.success("Cập nhật thông tin công ty thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      const message = "Không thể cập nhật thông tin công ty"

      form.setError("root", { message })
      toast.error(message)
    }
  }

  function handleReset() {
    form.reset(companyGeneralFormValues)
  }

  async function handleLogoUpload(logoFile: File) {
    try {
      await updateCompanyLogo.mutateAsync({ logoFile })
      toast.success("Cập nhật logo công ty thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể cập nhật logo công ty")
    }
  }

  async function handleCoverUpload(coverFile: File) {
    try {
      await updateCompanyCover.mutateAsync({ coverFile })
      toast.success("Cập nhật ảnh bìa thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể cập nhật ảnh bìa")
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-1 flex-col gap-6 p-4 md:gap-7 md:p-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Section title="Thông tin chung">
          <fieldset
            className="space-y-6 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isTextFormLoading}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="company-name">Tên công ty</FormLabel>
                  <FormControl>
                    <Input
                      id="company-name"
                      placeholder="VD: Acme Corporation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="company-website">Website</FormLabel>
                    <FormControl>
                      <Input
                        id="company-website"
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quy mô</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isTextFormLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn quy mô" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc gia</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isTextFormLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngành nghề</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isTextFormLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn ngành nghề" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root?.message ? (
              <Card>
                <CardContent className="p-5 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </CardContent>
              </Card>
            ) : null}
          </fieldset>
        </Section>

        <Section title="Hình ảnh công ty">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-6">
            <ImageUploadField
              title="Logo công ty"
              hint="Khuyến nghị: 400x400px, PNG/JPG"
              imageSrc={companyGeneral?.logoUrl ?? fallbackImages.logo}
              imageAlt="Logo công ty"
              disabled={isMediaLoading}
              isLoading={isCompanyGeneralLoading}
              isUploading={isUploadingLogo}
              onFileChange={handleLogoUpload}
            />
            <ImageUploadField
              title="Ảnh bìa"
              hint="Khuyến nghị: 1200x400px, PNG/JPG"
              imageSrc={companyGeneral?.coverUrl ?? fallbackImages.cover}
              imageAlt="Ảnh bìa công ty"
              disabled={isMediaLoading}
              isLoading={isCompanyGeneralLoading}
              isUploading={isUploadingCover}
              onFileChange={handleCoverUpload}
            />
          </div>
        </Section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-24"
            disabled={isTextFormLoading}
            onClick={handleReset}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="lg"
            className="min-w-36"
            disabled={isTextFormLoading}
          >
            {isTextFormLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Form>
  )
}