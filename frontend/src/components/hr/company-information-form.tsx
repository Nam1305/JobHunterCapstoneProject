"use client"

import { UploadIcon } from "lucide-react"

import { HRPlaceholderPage } from "@/components/hr/placeholder-page"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const companySizes = [
  "1-10 nhân sự",
  "11-50 nhân sự",
  "51-200 nhân sự",
  "201-500 nhân sự",
  "Trên 500 nhân sự",
]

const industries = [
  "Công nghệ thông tin",
  "Tài chính - ngân hàng",
  "Giáo dục",
  "Y tế",
  "Sản xuất",
]

const countries = ["Việt Nam", "Singapore", "Thái Lan", "Nhật Bản", "Hoa Kỳ"]

function ImageUploadField({
  title,
  hint,
  className,
}: {
  title: string
  hint: string
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
        className={[
          "flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <UploadIcon className="size-5" />
        <span>Nhấn để tải ảnh lên</span>
      </button>
    </div>
  )
}

function CompanyGeneralInformationForm() {
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
                placeholder="https://example.com"
                className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Quy mô</Label>
              <Select>
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
              <Select>
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
              <Select>
                <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/60 px-4 text-base md:text-base">
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
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
            />
            <ImageUploadField
              title="Ảnh bìa"
              hint="Khuyến nghị: 1200x400px, PNG/JPG"
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

export function CompanyInformationForm() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 p-4 md:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-normal">
              Thông tin công ty
            </h1>
            <p className="text-base text-muted-foreground">
              Quản lý hồ sơ và thông tin công ty của bạn.
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList  variant="default" className="w-full max-w-max rounded-full bg-muted p-1">
              <TabsTrigger 
                value="general" 
                // className="h-10 rounded-full px-2 py-0 text-xs leading-none transition-all sm:text-sm md:text-base"
              >
                Thông tin chung
              </TabsTrigger>
              
              <TabsTrigger 
                value="branding" 
                // className="h-10 rounded-full px-2 py-0 text-xs leading-none transition-all sm:text-sm md:text-base"
              >
                Branding
              </TabsTrigger>
              
              <TabsTrigger 
                value="branches" 
                // className="h-10 rounded-full px-2 py-0 text-xs leading-none transition-all sm:text-sm md:text-base"
              >
                Quản lý chi nhánh
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <CompanyGeneralInformationForm />
            </TabsContent>
            
            <TabsContent value="branding" className="mt-6">
              <HRPlaceholderPage
                title="Branding"
                description="Thiết lập nhận diện thương hiệu tuyển dụng của công ty."
              />
            </TabsContent>
            
            <TabsContent value="branches" className="mt-6">
              <HRPlaceholderPage
                title="Quản lý chi nhánh"
                description="Quản lý địa điểm làm việc và thông tin liên hệ của từng chi nhánh."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
