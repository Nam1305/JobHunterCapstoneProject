"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import {
  BoldIcon,
  ImagePlusIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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

type UploadedTeamPhoto = {
  id: string
  file: File
  previewUrl: string
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedPhotosRef = useRef<UploadedTeamPhoto[]>([])
  const [teamPhotoUrls, setTeamPhotoUrls] = useState(
    brandingMockData.teamPhotoUrls
  )
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedTeamPhoto[]>([])

  useEffect(() => {
    uploadedPhotosRef.current = uploadedPhotos
  }, [uploadedPhotos])

  useEffect(() => {
    return () => {
      uploadedPhotosRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl)
      )
    }
  }, [])

  function syncFileInput(nextPhotos: UploadedTeamPhoto[]) {
    if (!fileInputRef.current) {
      return
    }

    const dataTransfer = new DataTransfer()
    nextPhotos.forEach((photo) => dataTransfer.items.add(photo.file))
    fileInputRef.current.files = dataTransfer.files
  }

  function handleUploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    setUploadedPhotos((currentPhotos) => {
      const nextPhotos = [
        ...currentPhotos,
        ...selectedFiles.map((file) => ({
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ]

      syncFileInput(nextPhotos)
      return nextPhotos
    })
  }

  function handleRemoveExistingPhoto(indexToRemove: number) {
    setTeamPhotoUrls((currentUrls) =>
      currentUrls.filter((_, index) => index !== indexToRemove)
    )
  }

  function handleRemoveUploadedPhoto(photoId: string) {
    setUploadedPhotos((currentPhotos) => {
      const removedPhoto = currentPhotos.find((photo) => photo.id === photoId)
      const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId)

      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.previewUrl)
      }

      syncFileInput(nextPhotos)
      return nextPhotos
    })
  }

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teamPhotoUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={url}
              alt={`Ảnh đội ngũ ${index + 1}`}
              className="aspect-video h-full w-full object-cover"
            />
            <input type="hidden" name="teamPhotoUrls" value={url} />
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label={`Xóa ảnh đội ngũ ${index + 1}`}
              className="absolute right-2 top-2 bg-background/90 text-foreground shadow-sm hover:bg-background"
              onClick={() => handleRemoveExistingPhoto(index)}
            >
              <XIcon />
            </Button>
          </div>
        ))}

        {uploadedPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={photo.previewUrl}
              alt={`Ảnh đội ngũ đã tải lên ${index + 1}`}
              className="aspect-video h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label={`Xóa ảnh đội ngũ đã tải lên ${index + 1}`}
              className="absolute right-2 top-2 bg-background/90 text-foreground shadow-sm hover:bg-background"
              onClick={() => handleRemoveUploadedPhoto(photo.id)}
            >
              <XIcon />
            </Button>
          </div>
        ))}

        <input
          ref={fileInputRef}
          name="teamPhotos"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUploadPhoto}
        />
        <Button
          type="button"
          variant="outline"
          className="flex aspect-video h-auto flex-col gap-2 border-dashed bg-background text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlusIcon className="size-7" />
          <span className="text-sm font-medium">Thêm ảnh</span>
        </Button>
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
