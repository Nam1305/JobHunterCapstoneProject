"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Loader2Icon, UploadIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  useGetCompanyGeneral,
  useUpdateCompanyCover,
  useUpdateCompanyGeneral,
  useUpdateCompanyLogo,
} from "@/api/company.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const COMPANY_GENERAL_QUERY_KEY = ["companyGeneral"]

const companySizes = [
  "1-100 nhan su",
  "100 - 1000 nhan su",
  "1000 - 5000 nhan su",
  "5000+ nhan su",
]

const companyTypes = [
  "Cong nghe thong tin",
  "Tai chinh - ngan hang",
  "Giao duc",
  "Y te",
  "San xuat",
]

const countries = ["Viet Nam", "Singapore", "Thai Lan", "Nhat Ban", "Hoa Ky"]

const fallbackImages = {
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80",
  cover:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
}

function ImageUploadField({
  title,
  hint,
  imageSrc,
  imageAlt,
  className,
  disabled,
  isUploading,
  onFileChange,
}: {
  title: string
  hint: string
  imageSrc: string
  imageAlt: string
  className?: string
  disabled?: boolean
  isUploading?: boolean
  onFileChange: (file: File) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDisabled = disabled || isUploading

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      onFileChange(selectedFile)
    }

    event.target.value = ""
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">{title}</Label>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        aria-label={`Thay ${title.toLowerCase()}`}
        disabled={isDisabled}
        className={[
          "group relative flex min-h-44 w-full overflow-hidden rounded-2xl border border-dashed border-border bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => fileInputRef.current?.click()}
      >
        <span
          aria-label={imageAlt}
          role="img"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <span className="absolute inset-0 bg-background/10 transition-colors group-hover:bg-background/25" />
        <span className="relative m-auto flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 shadow-sm">
          {isUploading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadIcon className="size-4" />
          )}
          Thay anh
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
  const [name, setName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [country, setCountry] = useState("")
  const [companyType, setCompanyType] = useState("")
  const isTextFormLoading =
    isCompanyGeneralLoading || updateCompanyGeneral.isPending
  const isUploadingLogo = updateCompanyLogo.isPending
  const isUploadingCover = updateCompanyCover.isPending
  const isMediaLoading =
    isCompanyGeneralLoading || isUploadingLogo || isUploadingCover

  useEffect(() => {
    setName(companyGeneral?.name ?? "")
    setWebsiteUrl(companyGeneral?.websiteUrl ?? "")
    setTeamSize(companyGeneral?.teamSize ?? "")
    setCountry(companyGeneral?.country ?? "")
    setCompanyType(companyGeneral?.companyType ?? "")
  }, [companyGeneral])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await updateCompanyGeneral.mutateAsync({
        companyData: {
          name,
          websiteUrl,
          teamSize,
          country,
          companyType,
        },
      })
      toast.success("Cap nhat thong tin cong ty thanh cong")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      toast.error("Khong the cap nhat thong tin cong ty")
    }
  }

  function handleReset() {
    setName(companyGeneral?.name ?? "")
    setWebsiteUrl(companyGeneral?.websiteUrl ?? "")
    setTeamSize(companyGeneral?.teamSize ?? "")
    setCountry(companyGeneral?.country ?? "")
    setCompanyType(companyGeneral?.companyType ?? "")
  }

  async function handleLogoUpload(logoFile: File) {
    try {
      await updateCompanyLogo.mutateAsync({ logoFile })
      toast.success("Cap nhat logo cong ty thanh cong")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      toast.error("Khong the cap nhat logo cong ty")
    }
  }

  async function handleCoverUpload(coverFile: File) {
    try {
      await updateCompanyCover.mutateAsync({ coverFile })
      toast.success("Cap nhat anh bia thanh cong")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_GENERAL_QUERY_KEY,
      })
    } catch {
      toast.error("Khong the cap nhat anh bia")
    }
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 p-4 md:p-6">
          <fieldset
            className="space-y-6 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isTextFormLoading}
          >
            <div className="space-y-3">
              <Label htmlFor="company-name" className="text-base font-semibold">
                Ten cong ty
              </Label>
              <Input
                id="company-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="VD: Acme Corporation"
                className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="company-website"
                  className="text-base font-semibold"
                >
                  Website
                </Label>
                <Input
                  id="company-website"
                  type="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Quy mo</Label>
                <Select
                  value={teamSize}
                  onValueChange={setTeamSize}
                  disabled={isTextFormLoading}
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                    <SelectValue placeholder="Chon quy mo" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Quoc gia</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                  disabled={isTextFormLoading}
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                    <SelectValue placeholder="Chon quoc gia" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Nganh nghe</Label>
                <Select
                  value={companyType}
                  onValueChange={setCompanyType}
                  disabled={isTextFormLoading}
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                    <SelectValue placeholder="Chon nganh nghe" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isTextFormLoading}
              onClick={handleReset}
            >
              Huy
            </Button>
            <Button type="submit" size="lg" disabled={isTextFormLoading}>
              {isTextFormLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : null}
              Luu thay doi
            </Button>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <ImageUploadField
              title="Logo cong ty"
              hint="Khuyen nghi: 400x400px, PNG/JPG"
              imageSrc={companyGeneral?.logoUrl ?? fallbackImages.logo}
              imageAlt="Logo cong ty"
              disabled={isMediaLoading}
              isUploading={isUploadingLogo}
              onFileChange={handleLogoUpload}
            />
            <ImageUploadField
              title="Anh bia"
              hint="Khuyen nghi: 1200x400px, PNG/JPG"
              imageSrc={companyGeneral?.coverUrl ?? fallbackImages.cover}
              imageAlt="Anh bia cong ty"
              disabled={isMediaLoading}
              isUploading={isUploadingCover}
              onFileChange={handleCoverUpload}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
