"use client"

import { UploadIcon } from "lucide-react"

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

const companySizes = [
  "1-100 nhân sự",
  "100 - 1000 nhân sự",
  "1000 - 5000 nhân sự",
  "5000+ nhân sự",
]

const companyType = [
  "Công nghệ thông tin",
  "Tài chính - ngân hàng",
  "Giáo dục",
  "Y tế",
  "Sản xuất",
]

const countries = ["Việt Nam", "Singapore", "Thái Lan", "Nhật Bản", "Hoa Kỳ"]

const companyMockData = {
  name: "Nexora Technology",
  website: "https://nexora.example.com",
  size: "1-100 nhân sự",
  country: "Việt Nam",
  CompanyType: "Công nghệ thông tin",
  logo:
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80",
  cover:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
}

function ImageUploadField({
  title,
  hint,
  imageSrc,
  imageAlt,
  className,
}: {
  title: string
  hint: string
  imageSrc: string
  imageAlt: string
  className?: string
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">{title}</Label>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        aria-label={`Thay ${title.toLowerCase()}`}
        className={[
          "group relative flex min-h-44 w-full overflow-hidden rounded-2xl border border-dashed border-border bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          aria-label={imageAlt}
          role="img"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <span className="absolute inset-0 bg-background/10 transition-colors group-hover:bg-background/25" />
        <span className="relative m-auto flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 shadow-sm">
          <UploadIcon className="size-4" />
          Thay ảnh
        </span>
      </button>
    </div>
  )
}

export function CompanyGeneralInformationForm() {
  return (
    <form className="space-y-7">
      <Card>
        <CardContent className="space-y-6 p-4 md:p-6">
          <div className="space-y-3">
            <Label htmlFor="company-name" className="text-base font-semibold">
              Tên công ty
            </Label>
            <Input
              id="company-name"
              defaultValue={companyMockData.name}
              placeholder="VD: Acme Corporation"
              className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="company-website" className="text-base font-semibold">
                Website
              </Label>
              <Input
                id="company-website"
                type="url"
                defaultValue={companyMockData.website}
                placeholder="https://example.com"
                className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Quy mô</Label>
              <Select defaultValue={companyMockData.size}>
                <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                  <SelectValue placeholder="Chọn quy mô" />
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
              <Label className="text-base font-semibold">Quốc gia</Label>
              <Select defaultValue={companyMockData.country}>
                <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Ngành nghề</Label>
              <Select defaultValue={companyMockData.CompanyType}>
                <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {companyType.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <ImageUploadField
              title="Logo công ty"
              hint="Khuyến nghị: 400x400px, PNG/JPG"
              imageSrc={companyMockData.logo}
              imageAlt="Logo mẫu của Nexora Technology"
            />
            <ImageUploadField
              title="Ảnh bìa"
              hint="Khuyến nghị: 1200x400px, PNG/JPG"
              imageSrc={companyMockData.cover}
              imageAlt="Không gian văn phòng mẫu của Nexora Technology"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg">
          Hủy
        </Button>
        <Button type="submit" size="lg">
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}
