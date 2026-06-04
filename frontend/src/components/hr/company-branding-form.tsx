"use client"

import type { ReactNode } from "react"
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const brandingMockData = {
  overview: `<p>Nexora Technology xây dựng nền tảng tuyển dụng thông minh cho các doanh nghiệp đang tăng trưởng nhanh.</p>
<p>Chúng tôi tập trung vào trải nghiệm ứng viên, dữ liệu minh bạch và một môi trường làm việc nơi mỗi thành viên có quyền thử nghiệm ý tưởng mới.</p>`,
  benefits: `<ul>
  <li>Lương thưởng cạnh tranh theo năng lực và đánh giá định kỳ.</li>
  <li>Bảo hiểm sức khỏe mở rộng cho nhân viên.</li>
  <li>Ngân sách học tập hằng năm và chương trình mentoring nội bộ.</li>
  <li>Lịch làm việc linh hoạt, hỗ trợ hybrid cho các nhóm sản phẩm.</li>
</ul>`,
  teamPhotoUrls: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  ],
}

function EditorToolbarButton({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className="rounded-lg"
    >
      {children}
    </Button>
  )
}

function BrandingHtmlInput({
  id,
  label,
  defaultValue,
}: {
  id: string
  label: string
  defaultValue: string
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">
        {label}
      </Label>
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="flex h-11 items-center gap-1 border-b bg-muted/50 px-3">
          <EditorToolbarButton label="In đậm">
            <BoldIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="In nghiêng">
            <ItalicIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="Danh sách">
            <ListIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="Danh sách số">
            <ListOrderedIcon />
          </EditorToolbarButton>
        </div>
        <Textarea
          id={id}
          name={id}
          defaultValue={defaultValue}
          className="min-h-48 rounded-none border-0 bg-background px-4 py-3 font-mono text-sm shadow-none focus-visible:ring-0"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

function TeamPhotoUrlList() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base font-semibold">
          Ảnh đội ngũ (Team Photos)
        </Label>
        <p className="text-sm text-muted-foreground">
          Danh sách URL ảnh về đội ngũ công ty.
        </p>
      </div>
      <div className="space-y-3">
        {brandingMockData.teamPhotoUrls.map((url, index) => (
          <div key={url} className="space-y-2">
            <Label
              htmlFor={`team-photo-url-${index}`}
              className="text-sm font-medium"
            >
              URL ảnh {index + 1}
            </Label>
            <Input
              id={`team-photo-url-${index}`}
              name="teamPhotoUrls"
              type="url"
              defaultValue={url}
              className="h-11 bg-muted/50 px-4 text-base md:text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CompanyBrandingForm() {
  return (
    <form className="space-y-8">
      <BrandingHtmlInput
        id="company-overview"
        label="Tổng quan công ty (Overview)"
        defaultValue={brandingMockData.overview}
      />

      <BrandingHtmlInput
        id="company-benefits"
        label="Phúc lợi (Benefits)"
        defaultValue={brandingMockData.benefits}
      />

      <TeamPhotoUrlList />

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
