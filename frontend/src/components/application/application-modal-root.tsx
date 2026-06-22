"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CheckCircle2Icon,
  EyeIcon,
  FileUpIcon,
  Loader2Icon,
  UploadIcon,
} from "lucide-react"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useForm, useWatch, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  candidateQueryKeys,
  useApplyJobMutation,
  useApplicationStatusQuery,
  useCandidateResumesQuery,
  useUploadResumeMutation,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeModal } from "@/store/modal.slice"
import type { ResponseEntity } from "@/types/base"
import type { JobApplicationStatus, Resume } from "@/types/candidate"
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

function formatAppliedDate(date?: string | null) {
  if (!date) {
    return "không rõ"
  }

  const appliedDate = new Date(date)

  if (Number.isNaN(appliedDate.getTime())) {
    return "không rõ"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(appliedDate)
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ và tên."),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại."),
  email: z.email("Vui lòng nhập email hợp lệ.").trim(),
  resumeId: z.string().trim().min(1, "Vui lòng chọn CV để ứng tuyển."),
  coverLetter: z.string(),
})

type FormValues = z.infer<typeof formSchema>

const resumeFileExtensions = [".doc", ".docx", ".pdf"]
const maxResumeFileSize = 5 * 1024 * 1024

export function ApplicationModalRoot() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { applicationJob, openModal } = useAppSelector((state) => state.modal)
  const [closingApplicationJob, setClosingApplicationJob] =
    useState<typeof applicationJob>(null)
  const [closingApplicationStatus, setClosingApplicationStatus] =
    useState<JobApplicationStatus>()
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const { user } = useCurrentUser()
  const isOpen = openModal === "application"
  const jobId = applicationJob?.id ?? ""

  const {
    data: applicationStatusData,
    isFetching: isApplicationStatusFetching,
  } = useApplicationStatusQuery(jobId, isOpen && Boolean(jobId))
  const applyJobMutation = useApplyJobMutation()
  const uploadResumeMutation = useUploadResumeMutation()
  const applicationStatus = applicationStatusData?.data
  const displayApplicationJob = applicationJob ?? closingApplicationJob
  const displayApplicationStatus =
    applicationStatus ?? (!isOpen ? closingApplicationStatus : undefined)
  const isCheckingStatus = isOpen && isApplicationStatusFetching
  const isApplied = Boolean(
    displayApplicationStatus && displayApplicationStatus.status !== "NotApplied"
  )
  const shouldShowForm =
    isOpen &&
    Boolean(applicationStatusData) &&
    !isApplicationStatusFetching &&
    !isApplied

  const { data: resumesData, isFetching: isResumesFetching } =
    useCandidateResumesQuery(shouldShowForm)
  const resumes = resumesData?.data ?? []
  const firstResumeId = resumes[0]?.id ?? ""

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      resumeId: "",
      coverLetter: "",
    },
  })

  const coverLetter = useWatch({
    control: form.control,
    name: "coverLetter",
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    form.reset({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      resumeId: "",
      coverLetter: "",
    })
  }, [
    applicationJob?.id,
    form,
    isOpen,
    user?.email,
    user?.name,
    user?.phone,
  ])

  useEffect(() => {
    if (shouldShowForm && firstResumeId && !form.getValues("resumeId")) {
      form.setValue("resumeId", firstResumeId)
    }
  }, [firstResumeId, form, shouldShowForm])

  function closeApplicationModal() {
    if (isApplied) {
      setClosingApplicationJob(displayApplicationJob)
      setClosingApplicationStatus(displayApplicationStatus)
    } else {
      setClosingApplicationJob(null)
      setClosingApplicationStatus(undefined)
    }

    dispatch(closeModal())
  }

  function handleUploadButtonClick() {
    resumeInputRef.current?.click()
  }

  function handleResumeFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    const fileName = file.name.toLowerCase()
    const hasValidExtension = resumeFileExtensions.some((extension) =>
      fileName.endsWith(extension)
    )

    if (!hasValidExtension) {
      toast.error("Vui lòng chọn file *.doc, *.docx hoặc *.pdf.")
      return
    }

    if (file.size > maxResumeFileSize) {
      toast.error("Kích thước CV tối đa là 5MB.")
      return
    }

    uploadResumeMutation.mutate(file, {
      onSuccess: (response) => {
        const resume = response.data

        if (!resume) {
          toast.error("Không thể tải thông tin CV vừa tải lên.")
          return
        }

        toast.success(response.message || "Tải CV lên thành công")
        queryClient.setQueryData<ResponseEntity<Resume[]> | undefined>(
          candidateQueryKeys.resumes,
          (current) => {
            if (!current?.data) {
              return current
            }

            return {
              ...current,
              data: [
                resume,
                ...current.data.filter((item) => item.id !== resume.id),
              ],
            }
          }
        )
        void queryClient.invalidateQueries({
          queryKey: candidateQueryKeys.resumes,
        })

        form.setValue("resumeId", resume.id, { shouldValidate: true })
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "Không thể tải CV lên. Vui lòng thử lại."
        toast.error(message)
      },
    })
  }

  function handleApplyJob(values: FormValues) {
    if (!jobId) {
      form.setError("root", {
        message: "Không tìm thấy thông tin công việc.",
      })
      return
    }

    form.clearErrors("root")
    applyJobMutation.mutate(
      {
        resumeId: values.resumeId,
        jobId,
        email: values.email,
        name: values.name,
        phone: values.phone,
        coverLetter: values.coverLetter.trim() || null,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Ứng tuyển thành công")
          void queryClient.invalidateQueries({
            queryKey: candidateQueryKeys.applicationStatus(jobId),
          })
          closeApplicationModal()
        },
        onError: (error) => {
          const message =
            error.response?.data?.message ||
            "Không thể ứng tuyển công việc này. Vui lòng thử lại."
          toast.error(message)
          form.setError("root", {
            message,
          })
        },
      }
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeApplicationModal()}
    >
      <DialogContent className="flex flex-col max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl md:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">Ứng tuyển việc làm</DialogTitle>
          <DialogDescription>
            {displayApplicationJob?.title ?? "Vị trí đang tuyển"} tại{" "}
            {displayApplicationJob?.companyName ?? "Công ty tuyển dụng"}
          </DialogDescription>
        </DialogHeader>

        {isCheckingStatus ? (
          <ScrollableDialogBody>
            <ApplicationStatusSkeleton />
          </ScrollableDialogBody>
        ) : isApplied ? (
          <ScrollableDialogBody>
            <AppliedView status={displayApplicationStatus} />
          </ScrollableDialogBody>
        ) : (
          <ApplicationForm
            applyJobMutation={applyJobMutation}
            coverLetter={coverLetter}
            form={form}
            isResumesFetching={isResumesFetching}
            onCancel={closeApplicationModal}
            onResumeFileChange={handleResumeFileChange}
            onSubmit={handleApplyJob}
            onUploadButtonClick={handleUploadButtonClick}
            resumeInputRef={resumeInputRef}
            resumes={resumes}
            uploadResumeMutation={uploadResumeMutation}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ScrollableDialogBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
      {children}
    </div>
  )
}

function AppliedView({ status }: { status?: JobApplicationStatus }) {
  const appliedCvUrl = status?.cvAppliedUrl.trim() ?? ""
  const appliedCvFileName = status?.fileName?.trim()

  return (
    <div className="space-y-3">
      <Alert className="border-primary/30 bg-primary/10">
        <CheckCircle2Icon className="text-primary" />
        <AlertTitle>
          Bạn đã ứng tuyển công việc này vào ngày{" "}
          {formatAppliedDate(status?.appliedAt)}
        </AlertTitle>
        <AlertDescription>
          Hồ sơ ứng tuyển của bạn đã được gửi tới nhà tuyển dụng.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">CV đã ứng tuyển</p>
          <p
            className="truncate text-sm font-medium"
            title={appliedCvFileName || "CV đã ứng tuyển"}
          >
            {appliedCvFileName || "CV đã ứng tuyển"}
          </p>
        </div>

        {appliedCvUrl ? (
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <a href={appliedCvUrl} target="_blank" rel="noreferrer">
              <EyeIcon className="size-4" />
              Xem CV
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

type ApplicationFormProps = {
  applyJobMutation: ReturnType<typeof useApplyJobMutation>
  coverLetter: string
  form: UseFormReturn<FormValues>
  isResumesFetching: boolean
  onCancel: () => void
  onResumeFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (values: FormValues) => void
  onUploadButtonClick: () => void
  resumeInputRef: React.RefObject<HTMLInputElement | null>
  resumes: Resume[]
  uploadResumeMutation: ReturnType<typeof useUploadResumeMutation>
}

function ApplicationForm({
  applyJobMutation,
  coverLetter,
  form,
  isResumesFetching,
  onCancel,
  onResumeFileChange,
  onSubmit,
  onUploadButtonClick,
  resumeInputRef,
  resumes,
  uploadResumeMutation,
}: ApplicationFormProps) {
  return (
    <Form {...form}>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ScrollableDialogBody>
          <div className="space-y-5">
            <BasicInfoSection form={form} />
            <ResumeSection
              form={form}
              isResumesFetching={isResumesFetching}
              onResumeFileChange={onResumeFileChange}
              onUploadButtonClick={onUploadButtonClick}
              resumeInputRef={resumeInputRef}
              resumes={resumes}
              uploadResumeMutation={uploadResumeMutation}
            />
            <CoverLetterSection coverLetter={coverLetter} form={form} />
          </div>
        </ScrollableDialogBody>

        <DialogFooter className="shrink-0 pt-4">
          {form.formState.errors.root?.message ? (
            <p className="text-sm text-destructive sm:mr-auto">
              {form.formState.errors.root.message}
            </p>
          ) : null}
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={
              isResumesFetching ||
              uploadResumeMutation.isPending ||
              applyJobMutation.isPending
            }
          >
            {applyJobMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            {applyJobMutation.isPending ? "Đang nộp..." : "Nộp CV"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

function BasicInfoSection({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Thông tin cơ bản</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>
                Họ và tên <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số điện thoại <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  )
}

type ResumeSectionProps = {
  form: UseFormReturn<FormValues>
  isResumesFetching: boolean
  onResumeFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onUploadButtonClick: () => void
  resumeInputRef: React.RefObject<HTMLInputElement | null>
  resumes: Resume[]
  uploadResumeMutation: ReturnType<typeof useUploadResumeMutation>
}

function ResumeSection({
  form,
  isResumesFetching,
  onResumeFileChange,
  onUploadButtonClick,
  resumeInputRef,
  resumes,
  uploadResumeMutation,
}: ResumeSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Danh sách CV của bạn</h3>
      {isResumesFetching ? (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Đang tải CV...
        </div>
      ) : resumes.length ? (
        <ResumeRadioGroup form={form} resumes={resumes} />
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Bạn chưa có CV nào.
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          ref={resumeInputRef}
          type="file"
          accept=".doc,.docx,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={onResumeFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          disabled={uploadResumeMutation.isPending}
          onClick={onUploadButtonClick}
        >
          {uploadResumeMutation.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <FileUpIcon />
          )}
          {uploadResumeMutation.isPending
            ? "Đang tải lên..."
            : "Tải lên CV mới"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Hỗ trợ *.doc, *.docx, *.pdf, và &lt; 5MB
        </p>
      </div>
    </section>
  )
}

function ResumeRadioGroup({
  form,
  resumes,
}: {
  form: UseFormReturn<FormValues>
  resumes: Resume[]
}) {
  return (
    <FormField
      control={form.control}
      name="resumeId"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup value={field.value} onValueChange={field.onChange}>
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CoverLetterSection({
  coverLetter,
  form,
}: {
  coverLetter: string
  form: UseFormReturn<FormValues>
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Thư giới thiệu</h3>
      <FormField
        control={form.control}
        name="coverLetter"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <HtmlInput
                className="min-h-32"
                placeholder="Nhập đoạn giới thiệu bản thân hoặc đường link portfolio của bạn"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="border-t bg-muted/40 px-4 py-2 text-right text-sm text-muted-foreground">
        {countWords(coverLetter)} words
      </div>
    </section>
  )
}

function ApplicationStatusSkeleton() {
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-16 sm:col-span-2" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full" />
      </section>

      <section className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full" />
      </section>
    </div>
  )
}
