"use client"

import {
  BoldIcon,
  ImageIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const brandingMockData = {
  overview:
    "Nexora Technology xây dựng nền tảng tuyển dụng thông minh cho các doanh nghiệp đang tăng trưởng nhanh. Chúng tôi tập trung vào trải nghiệm ứng viên, dữ liệu minh bạch và một môi trường làm việc nơi mỗi thành viên có quyền thử nghiệm ý tưởng mới.",
  benefits:
    "Lương thưởng cạnh tranh, bảo hiểm sức khỏe mở rộng, ngân sách học tập hằng năm, lịch làm việc linh hoạt và chương trình mentoring nội bộ cho từng giai đoạn phát triển nghề nghiệp.",
  teamPhotos: [
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      alt: "Đội ngũ công ty đang trao đổi trong văn phòng",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
      alt: "Nhóm nhân sự làm việc cùng nhau tại bàn họp",
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "Buổi workshop của đội ngũ công ty",
    },
  ],
}

function EditorToolbarButton({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
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

function BrandingTextEditor({
  id,
  label,
  placeholder,
  defaultValue,
}: {
  id: string
  label: string
  placeholder: string
  defaultValue: string
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">
        {label}
      </Label>
      <div className="overflow-hidden rounded-xl border border-input bg-background">
        <div className="flex h-10 items-center gap-1 border-b bg-muted/60 px-2">
          <EditorToolbarButton label="In đậm">
            <BoldIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="In nghiêng">
            <ItalicIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="Danh sách">
            <ListIcon />
          </EditorToolbarButton>
          <EditorToolbarButton label="Danh sách đánh số">
            <ListOrderedIcon />
          </EditorToolbarButton>
        </div>
        <Textarea
          id={id}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="min-h-56 rounded-none border-0 bg-background px-4 py-3 focus-visible:ring-0"
        />
      </div>
    </div>
  )
}

function TeamPhotosUpload() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base font-semibold">
          Ảnh đội ngũ (Team Photos)
        </Label>
        <p className="text-sm text-muted-foreground">
          Tải lên nhiều ảnh về đội ngũ công ty.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {brandingMockData.teamPhotos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            aria-label={photo.alt}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
              style={{ backgroundImage: `url(${photo.src})` }}
            />
          </button>
        ))}
        <button
          type="button"
          className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ImageIcon className="size-6" />
          <span>Thêm ảnh</span>
        </button>
      </div>
    </div>
  )
}

export function CompanyBrandingForm() {
  return (
    <form className="space-y-8">
      <BrandingTextEditor
        id="company-overview"
        label="Tổng quan công ty (Overview)"
        placeholder="Giới thiệu ngắn gọn về công ty, sứ mệnh và môi trường làm việc."
        defaultValue={brandingMockData.overview}
      />

      <BrandingTextEditor
        id="company-benefits"
        label="Phúc lợi (Benefits)"
        placeholder="Mô tả các phúc lợi, chính sách đãi ngộ và điểm nổi bật dành cho nhân viên."
        defaultValue={brandingMockData.benefits}
      />

      <TeamPhotosUpload />

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
