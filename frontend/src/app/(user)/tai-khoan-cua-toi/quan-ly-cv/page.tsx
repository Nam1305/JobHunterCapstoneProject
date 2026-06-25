"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2Icon, UploadIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  candidateQueryKeys,
  useCandidateResumesQuery,
  useUploadResumeMutation,
  useDeleteResumeMutation,
} from "@/api/candidate.api"
import type { Resume } from "@/types/candidate"
import { CVTable } from "./_components/cv-table"

const ALLOWED_EXTENSIONS = [ ".pdf"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function ManageCVPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch candidate resumes
  const { data: resumesResponse, isLoading } = useCandidateResumesQuery()
  const resumes = resumesResponse?.data ?? []

  // Mutations
  const uploadResumeMutation = useUploadResumeMutation()
  const deleteResumeMutation = useDeleteResumeMutation()

  // File Upload Handler
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Reset file input value so same file can be uploaded again if needed
    event.target.value = ""

    if (!file) return

    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    )

    if (!hasValidExtension) {
      toast.error("Vui lòng chọn file định dạng .pdf.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kích thước file CV tối đa là 5MB.")
      return
    }

    uploadResumeMutation.mutate(file, {
      onSuccess: (response) => {
        toast.success(response.message || "Tải lên CV thành công!")
        queryClient.invalidateQueries({
          queryKey: candidateQueryKeys.resumes,
        })
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "Không thể tải CV lên. Vui lòng thử lại."
        toast.error(message)
      },
    })
  }

  // Delete Action Handlers
  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume)
  }

  const handleConfirmDelete = () => {
    if (!resumeToDelete) return
    const targetId = resumeToDelete.id
    const targetName = resumeToDelete.fileName || "CV"

    setDeletingId(targetId)
    setResumeToDelete(null)

    deleteResumeMutation.mutate(targetId, {
      onSuccess: (response) => {
        toast.success(response.message || `Đã xóa CV "${targetName}" thành công.`)
        queryClient.invalidateQueries({
          queryKey: candidateQueryKeys.resumes,
        })
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "Xóa CV thất bại. Vui lòng thử lại."
        toast.error(message)
      },
      onSettled: () => {
        setDeletingId(null)
      },
    })
  }

  // Download/View Action Handler
  const handleDownload = (resume: Resume) => {
    if (!resume.fileUrl) {
      toast.error("Không tìm thấy đường dẫn tải file CV.")
      return
    }
    window.open(resume.fileUrl, "_blank")
  }

  return (
    <>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b pb-4 mb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Quản lý CV
          </CardTitle>
          <CardDescription>
            Xem, tải lên hoặc xóa các file CV của bạn.
          </CardDescription>
          <CardAction>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadResumeMutation.isPending}
            />
            <Button
              onClick={handleUploadButtonClick}
              disabled={uploadResumeMutation.isPending || isLoading}
              className="font-medium"
            >
              {uploadResumeMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 size-4" />
                  Tải lên CV
                </>
              )}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <CVTable
            data={resumes}
            isLoading={isLoading}
            onDownload={handleDownload}
            onDelete={handleDeleteClick}
            deletingId={deletingId}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(resumeToDelete)}
        onOpenChange={(open) => {
          if (!open) setResumeToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa CV</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa file CV
              <strong className="text-foreground font-semibold">
                {resumeToDelete?.fileName}
              </strong>
              ? Hành động này không thể hoàn tác và CV sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
