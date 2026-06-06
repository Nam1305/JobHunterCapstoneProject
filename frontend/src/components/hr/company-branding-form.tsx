"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { ImagePlusIcon, XIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  useAddTeamImages,
  useDeleteTeamImage,
  useGetBranding,
  useUpdateBranding,
} from "@/api/company.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { HtmlInput } from "@/components/hr/html-input"

const COMPANY_BRANDING_QUERY_KEY = ["companyBranding"]

type UploadedTeamPhoto = {
  id: string
  file: File
  previewUrl: string
}

function BrandingHtmlInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">
        {label}
      </Label>
      <HtmlInput id={id} name={id} value={value} onValueChange={onChange} />
    </div>
  )
}

function TeamPhotoUrlList({
  initialTeamPhotoUrls,
}: {
  initialTeamPhotoUrls: string[]
}) {
  const queryClient = useQueryClient()
  const addTeamImages = useAddTeamImages()
  const deleteTeamImage = useDeleteTeamImage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedPhotosRef = useRef<UploadedTeamPhoto[]>([])
  const [teamPhotoUrls, setTeamPhotoUrls] = useState(initialTeamPhotoUrls)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedTeamPhoto[]>([])
  const [deletingImageUrl, setDeletingImageUrl] = useState<string | null>(null)
  const isMutatingImages = addTeamImages.isPending || deleteTeamImage.isPending

  useEffect(() => {
    setTeamPhotoUrls(initialTeamPhotoUrls)
  }, [initialTeamPhotoUrls])

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

  async function handleUploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    const previewPhotos = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setUploadedPhotos((currentPhotos) => [...currentPhotos, ...previewPhotos])

    try {
      await addTeamImages.mutateAsync({ images: selectedFiles })
      toast.success("Tải ảnh đội ngũ thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_BRANDING_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể tải ảnh đội ngũ")
    } finally {
      previewPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
      setUploadedPhotos((currentPhotos) =>
        currentPhotos.filter(
          (photo) =>
            !previewPhotos.some((previewPhoto) => previewPhoto.id === photo.id)
        )
      )

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  async function handleRemoveExistingPhoto(
    imageUrl: string,
    indexToRemove: number
  ) {
    setDeletingImageUrl(imageUrl)
    setTeamPhotoUrls((currentUrls) =>
      currentUrls.filter((_, index) => index !== indexToRemove)
    )

    try {
      await deleteTeamImage.mutateAsync({ imageUrl })
      toast.success("Xóa ảnh đội ngũ thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_BRANDING_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể xóa ảnh đội ngũ")
      setTeamPhotoUrls(initialTeamPhotoUrls)
    } finally {
      setDeletingImageUrl(null)
    }
  }

  function handleRemoveUploadedPhoto(photoId: string) {
    setUploadedPhotos((currentPhotos) => {
      const removedPhoto = currentPhotos.find((photo) => photo.id === photoId)
      const nextPhotos = currentPhotos.filter((photo) => photo.id !== photoId)

      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.previewUrl)
      }

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
              disabled={isMutatingImages || deletingImageUrl === url}
              onClick={() => handleRemoveExistingPhoto(url, index)}
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
          disabled={isMutatingImages}
          onChange={handleUploadPhoto}
        />
        <Button
          type="button"
          variant="outline"
          className="flex aspect-video h-auto flex-col gap-2 border-dashed bg-background text-muted-foreground hover:text-foreground"
          disabled={isMutatingImages}
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
  const queryClient = useQueryClient()
  const { data: brandingResponse } = useGetBranding()
  const updateBranding = useUpdateBranding()
  const branding = brandingResponse?.data
  const [overview, setOverview] = useState("")
  const [benefits, setBenefits] = useState("")

  useEffect(() => {
    setOverview(branding?.overview ?? "")
    setBenefits(branding?.benefits ?? "")
  }, [branding])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await updateBranding.mutateAsync({
        brandingData: {
          overview,
          benefits,
        },
      })
      toast.success("Cập nhật thương hiệu công ty thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_BRANDING_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể cập nhật thương hiệu công ty")
    }
  }

  function handleReset() {
    setOverview(branding?.overview ?? "")
    setBenefits(branding?.benefits ?? "")
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 p-4 md:p-6">
      <BrandingHtmlInput
        id="company-overview"
        label="Tổng quan công ty (Overview)"
        value={overview}
        onChange={setOverview}
      />

      <BrandingHtmlInput
        id="company-benefits"
        label="Phúc lợi (Benefits)"
        value={benefits}
        onChange={setBenefits}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={updateBranding.isPending}
          onClick={handleReset}
        >
          Hủy
        </Button>
        <Button type="submit" size="lg" disabled={updateBranding.isPending}>
          Lưu thay đổi
        </Button>
      </div>

      

          <Separator />

          <TeamPhotoUrlList initialTeamPhotoUrls={branding?.teamPhotoUrls ?? []} />
        </CardContent>
      </Card>
    </form>
  )
}
