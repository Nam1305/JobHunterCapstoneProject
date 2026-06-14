"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { ImagePlusIcon, XIcon } from "lucide-react"
import Image from "next/image"
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  useAddTeamImages,
  useDeleteTeamImage,
  useGetBranding,
  useUpdateBranding,
} from "@/api/hrcompany.api"
import { HtmlInput } from "@/components/hr/html-input"
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
import { Label } from "@/components/ui/label"

const COMPANY_BRANDING_QUERY_KEY = ["companyBranding"]

const brandingFormSchema = z.object({
  overview: z.string(),
  benefits: z.string(),
})

type BrandingFormValues = z.infer<typeof brandingFormSchema>

const defaultBrandingFormValues: BrandingFormValues = {
  overview: "",
  benefits: "",
}

function toBrandingFormValues(
  branding: {
    overview?: string
    benefits?: string
  } | null | undefined
): BrandingFormValues {
  return {
    overview: branding?.overview ?? "",
    benefits: branding?.benefits ?? "",
  }
}

type UploadedTeamPhoto = {
  id: string
  file: File
  previewUrl: string
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

function BrandingHtmlInput({
  disabled,
  id,
  label,
  onBlur,
  onChange,
  value,
}: {
  disabled?: boolean
  id: string
  label: string
  onBlur: () => void
  onChange: (value: string) => void
  value: string
}) {
  return (
    <FormItem className="space-y-2.5">
      <FormLabel htmlFor={id}>
        {label}
      </FormLabel>
      <HtmlInput
        id={id}
        disabled={disabled}
        name={id}
        value={value}
        onBlur={onBlur}
        onValueChange={onChange}
        textareaWrapper={(editor) => <FormControl>{editor}</FormControl>}
      />
      <FormMessage />
    </FormItem>
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
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedTeamPhoto[]>([])
  const [deletingImageUrl, setDeletingImageUrl] = useState<string | null>(null)
  const isMutatingImages = addTeamImages.isPending || deleteTeamImage.isPending

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

  function handleUploadPhoto(event: ChangeEvent<HTMLInputElement>) {
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

    addTeamImages.mutate(
      { images: selectedFiles },
      {
        onSuccess: () => {
          toast.success("Tải ảnh đội ngũ thành công")
          void queryClient.invalidateQueries({
            queryKey: COMPANY_BRANDING_QUERY_KEY,
          })
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message || "Không thể tải ảnh đội ngũ"
          )
        },
        onSettled: () => {
          previewPhotos.forEach((photo) =>
            URL.revokeObjectURL(photo.previewUrl)
          )
          setUploadedPhotos((currentPhotos) =>
            currentPhotos.filter(
              (photo) =>
                !previewPhotos.some(
                  (previewPhoto) => previewPhoto.id === photo.id
                )
            )
          )

          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        },
      }
    )
  }

  function handleRemoveExistingPhoto(imageUrl: string) {
    setDeletingImageUrl(imageUrl)

    deleteTeamImage.mutate(
      { imageUrl },
      {
        onSuccess: () => {
          toast.success("Xóa ảnh đội ngũ thành công")
          void queryClient.invalidateQueries({
            queryKey: COMPANY_BRANDING_QUERY_KEY,
          })
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message || "Không thể xóa ảnh đội ngũ"
          )
        },
        onSettled: () => {
          setDeletingImageUrl(null)
        },
      }
    )
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
      <div className="space-y-1.5">
        <Label>
          Ảnh đội ngũ (Team Photos)
        </Label>
        <p className="text-sm text-muted-foreground">
          Tải lên nhiều ảnh về đội ngũ công ty.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {initialTeamPhotoUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative overflow-hidden rounded-lg border bg-muted"
          >
            <Image
              src={url}
              alt={`Ảnh đội ngũ ${index + 1}`}
              width={640}
              height={360}
              unoptimized
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
              onClick={() => handleRemoveExistingPhoto(url)}
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
            <Image
              src={photo.previewUrl}
              alt={`Ảnh đội ngũ đã tải lên ${index + 1}`}
              width={640}
              height={360}
              unoptimized
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
  const { data: brandingResponse, isLoading: isBrandingLoading } =
    useGetBranding()
  const updateBranding = useUpdateBranding()
  const branding = brandingResponse?.data
  const isFormLoading = isBrandingLoading || updateBranding.isPending
  const hasHydratedFormRef = useRef(false)
  const initialFormValuesRef = useRef(defaultBrandingFormValues)
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingFormSchema),
    defaultValues: defaultBrandingFormValues,
  })

  useEffect(() => {
    if (!branding || hasHydratedFormRef.current) {
      return
    }

    const formValues = toBrandingFormValues(branding)

    form.reset(formValues)
    initialFormValuesRef.current = formValues
    hasHydratedFormRef.current = true
  }, [branding, form])

  function handleSubmit(values: BrandingFormValues) {
    form.clearErrors("root")
    updateBranding.mutate(
      {
        brandingData: values,
      },
      {
        onSuccess: (response) => {
          initialFormValuesRef.current = values
          toast.success(
            response.message || "Cập nhật thương hiệu công ty thành công"
          )
        },
        onError: (error) => {
          const message =
            error.response?.data.message ||
            "Không thể cập nhật thương hiệu công ty"

          form.setError("root", { message })
          toast.error(message)
        },
      }
    )
  }

  function handleReset() {
    form.reset(initialFormValuesRef.current)
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-1 flex-col gap-6 p-4 md:gap-7 md:p-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Section title="Nội dung thương hiệu">
            <fieldset
              className="space-y-6 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isFormLoading}
            >
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <BrandingHtmlInput
                    id="company-overview"
                    disabled={isFormLoading}
                    label="Tổng quan công ty (Overview)"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <BrandingHtmlInput
                    id="company-benefits"
                    disabled={isFormLoading}
                    label="Phúc lợi (Benefits)"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />

              {form.formState.errors.root?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="min-w-24"
                  disabled={updateBranding.isPending}
                  onClick={handleReset}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="min-w-36"
                  disabled={updateBranding.isPending}
                >
                  Lưu thay đổi
                </Button>
              </div>

            </fieldset>
        </Section>

        <Section title="Hình ảnh đội ngũ">
          <TeamPhotoUrlList initialTeamPhotoUrls={branding?.teamPhotoUrls ?? []} />
        </Section>
      </form>
    </Form>
  )
}
