"use client"

import { useMemo, useState } from "react"
import { EyeIcon, FileUpIcon, Loader2Icon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import {
  candidateQueryKeys,
  useApplyJobMutation,
  useApplicationStatusQuery,
  useCandidateResumesQuery,
} from "@/api/candidate.api"
import { HtmlInput } from "@/components/hr/html-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeModal } from "@/store/modal.slice"
import { useQueryClient } from "@tanstack/react-query"

function countWords(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim()

  if (!text) {
    return 0
  }

  return text.split(/\s+/).length
}

export function ApplicationModalRoot() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { applicationJob, openModal } = useAppSelector((state) => state.modal)
  const { user } = useCurrentUser()
  const [selectedCvId, setSelectedCvId] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [validationMessage, setValidationMessage] = useState("")
  const [applicantInfo, setApplicantInfo] = useState<{
    name?: string
    phone?: string
    email?: string
  }>({})
  const isOpen = openModal === "application"
  const jobId = applicationJob?.id ?? ""
  const {
    data: applicationStatusData,
    isFetching: isApplicationStatusFetching,
  } = useApplicationStatusQuery(jobId, isOpen && Boolean(jobId))
  const { data: resumesData, isFetching: isResumesFetching } =
    useCandidateResumesQuery(isOpen)
  const applyJobMutation = useApplyJobMutation()
  const applicationStatus = applicationStatusData?.data
  const appliedCvUrl = applicationStatus?.cvAppliedUrl.trim() ?? ""
  const hasAppliedCv = appliedCvUrl.length > 0
  const resumes = resumesData?.data ?? []
  const selectedResumeId = selectedCvId || resumes[0]?.id || ""

  const selectedJob = useMemo(
    () => ({
      title: applicationJob?.title ?? "Vị trí đang tuyển",
      companyName: applicationJob?.companyName ?? "Công ty tuyển dụng",
    }),
    [applicationJob]
  )

  function closeApplicationModal() {
    setApplicantInfo({})
    setCoverLetter("")
    setSelectedCvId("")
    setValidationMessage("")
    applyJobMutation.reset()
    dispatch(closeModal())
  }

  function handleApplyJob() {
    const name = (applicantInfo.name ?? user?.name ?? "").trim()
    const phone = (applicantInfo.phone ?? user?.phone ?? "").trim()
    const email = (applicantInfo.email ?? user?.email ?? "").trim()
    const trimmedCoverLetter = coverLetter.trim()

    if (!jobId) {
      setValidationMessage("Không tìm thấy thông tin công việc.")
      return
    }

    if (!name || !phone || !email) {
      setValidationMessage("Vui lòng nhập đầy đủ họ tên, số điện thoại và email.")
      return
    }

    if (!selectedResumeId) {
      setValidationMessage("Vui lòng chọn CV để ứng tuyển.")
      return
    }

    setValidationMessage("")
    applyJobMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId,
        email,
        name,
        phone,
        coverLetter: trimmedCoverLetter || null,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Ứng tuyển thành công")
          void queryClient.invalidateQueries({
            queryKey: candidateQueryKeys.applicationStatus(jobId),
          })
        },
        onError: (error) => {
          const message =
            error.response?.data?.message ||
            "Không thể ứng tuyển công việc này. Vui lòng thử lại."
          toast.error(message)
          setValidationMessage(message)
        },
      }
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeApplicationModal()}
    >
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Ứng tuyển việc làm</DialogTitle>
          <DialogDescription>
            {selectedJob.title} tại {selectedJob.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-3">
            <h3 className="font-semibold">Thông tin cơ bản</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium">
                  Họ và tên <span className="text-destructive">*</span>
                </span>
                <Input
                  value={applicantInfo.name ?? user?.name ?? ""}
                  placeholder="Nhập họ và tên"
                  onChange={(event) =>
                    setApplicantInfo((currentInfo) => ({
                      ...currentInfo,
                      name: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium">
                  Số điện thoại <span className="text-destructive">*</span>
                </span>
                <Input
                  type="tel"
                  value={applicantInfo.phone ?? user?.phone ?? ""}
                  placeholder="Nhập số điện thoại"
                  onChange={(event) =>
                    setApplicantInfo((currentInfo) => ({
                      ...currentInfo,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </span>
                <Input
                  type="email"
                  value={applicantInfo.email ?? user?.email ?? ""}
                  placeholder="Nhập email"
                  onChange={(event) =>
                    setApplicantInfo((currentInfo) => ({
                      ...currentInfo,
                      email: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Danh sách CV của bạn</h3>
            {isApplicationStatusFetching ||
            (!hasAppliedCv && isResumesFetching) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Đang tải CV...
              </div>
            ) : hasAppliedCv ? (
              <Alert>
                <AlertTitle>Bạn đã ứng tuyển vào công việc này</AlertTitle>
                <AlertDescription className="mt-2">
                  <Button asChild type="button" variant="outline" size="sm">
                    <a href={appliedCvUrl} target="_blank" rel="noreferrer">
                      <EyeIcon />
                      Xem CV đã ứng tuyển
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : resumes.length ? (
              <RadioGroup
                value={selectedResumeId}
                onValueChange={setSelectedCvId}
              >
                {resumes.map((resume) => (
                  <FieldLabel
                    key={resume.id}
                    htmlFor={`candidate-cv-${resume.id}`}
                  >
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>
                          {resume.fileName ?? "CV chưa có tên"}
                        </FieldTitle>
                        <FieldDescription className="flex items-center gap-1.5 text-xs">
                          <UploadIcon className="size-3.5" />
                          <span>
                            Đã tải lên
                            {resume.createdDate
                              ? ` · ${new Intl.DateTimeFormat("vi-VN").format(
                                  new Date(resume.createdDate)
                                )}`
                              : ""}
                          </span>
                        </FieldDescription>
                      </FieldContent>
                      <div className="flex items-center gap-3">
                        {resume.fileUrl ? (
                          <Button
                            asChild
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <a
                              href={resume.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <EyeIcon />
                              <span className="sr-only">Xem CV</span>
                            </a>
                          </Button>
                        ) : null}
                        <RadioGroupItem
                          value={resume.id}
                          id={`candidate-cv-${resume.id}`}
                        />
                      </div>
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Bạn chưa có CV nào.
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" className="w-fit" disabled>
                <FileUpIcon />
                Tải lên CV mới
              </Button>
              <p className="text-sm text-muted-foreground">
                Hỗ trợ *.doc, *.docx, *.pdf, và &lt; 5MB
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold">Thư giới thiệu</h3>
            <div className="overflow-hidden rounded-xl border">
              <HtmlInput
                className="min-h-32"
                placeholder="Nhập đoạn giới thiệu bản thân hoặc đường link portfolio của bạn"
                value={coverLetter}
                onValueChange={setCoverLetter}
              />
              <div className="border-t bg-muted/40 px-4 py-2 text-right text-sm text-muted-foreground">
                {countWords(coverLetter)} words
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          {validationMessage ? (
            <p className="text-sm text-destructive sm:mr-auto">
              {validationMessage}
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={closeApplicationModal}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={
              hasAppliedCv ||
              isApplicationStatusFetching ||
              isResumesFetching ||
              applyJobMutation.isPending
            }
            onClick={handleApplyJob}
          >
            {applyJobMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            {applyJobMutation.isPending ? "Đang nộp..." : "Nộp CV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
