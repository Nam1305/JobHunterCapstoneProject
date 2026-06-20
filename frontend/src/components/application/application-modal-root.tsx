"use client"

import { useMemo, useState } from "react"
import { EyeIcon, FileUpIcon, UploadIcon } from "lucide-react"

import { HtmlInput } from "@/components/hr/html-input"
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

type CandidateCv = {
  id: string
  fileName: string
  source: string
  uploadedAt: string
}

const candidateCvs: CandidateCv[] = [
  {
    id: "ba",
    fileName: "Doan-Kien-Quoc-BA-2026.pdf",
    source: "Uploaded from computer",
    uploadedAt: "12:02 24/05/2026",
  },
  {
    id: "java",
    fileName: "Doan-Kien-Quoc-JAVA-2026.pdf",
    source: "Uploaded from computer",
    uploadedAt: "12:02 24/05/2026",
  },
  {
    id: "dotnet",
    fileName: "Doan-Kien-Quoc-DOTNET-2026.pdf",
    source: "Uploaded from computer",
    uploadedAt: "12:02 24/05/2026",
  },
]

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
  const { applicationJob, openModal } = useAppSelector((state) => state.modal)
  const { user } = useCurrentUser()
  const [selectedCvId, setSelectedCvId] = useState(candidateCvs[0]?.id ?? "")
  const [coverLetter, setCoverLetter] = useState("")
  const [applicantInfo, setApplicantInfo] = useState<{
    name?: string
    phone?: string
    email?: string
  }>({})
  const isOpen = openModal === "application"

  const selectedJob = useMemo(
    () => ({
      title: applicationJob?.title ?? "Vị trí đang tuyển",
      companyName: applicationJob?.companyName ?? "Công ty tuyển dụng",
    }),
    [applicationJob]
  )

  function closeApplicationModal() {
    setApplicantInfo({})
    dispatch(closeModal())
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
            <RadioGroup value={selectedCvId} onValueChange={setSelectedCvId}>
              {candidateCvs.map((cv) => (
                <FieldLabel key={cv.id} htmlFor={`candidate-cv-${cv.id}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{cv.fileName}</FieldTitle>
                      <FieldDescription className="flex items-center gap-1.5 text-xs">
                        <UploadIcon className="size-3.5" />
                        <span>
                          {cv.source} · {cv.uploadedAt}
                        </span>
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex items-center gap-3">
                      <EyeIcon className="size-4" />
                      <RadioGroupItem
                        value={cv.id}
                        id={`candidate-cv-${cv.id}`}
                      />
                    </div>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>

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
          <Button
            type="button"
            variant="outline"
            onClick={closeApplicationModal}
          >
            Hủy
          </Button>
          <Button type="button" disabled>
            Nộp CV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
