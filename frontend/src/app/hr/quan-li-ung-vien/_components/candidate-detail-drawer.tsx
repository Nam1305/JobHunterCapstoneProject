"use client"

import * as React from "react"
import {
  MailIcon,
  PhoneIcon,
  SaveIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  hrRecruitmentQueryKeys,
  useHrRecruitmentApplicationDetailQuery,
  useUpdateApplicationStatusMutation,
} from "@/api/hr-recruitment.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ResponseEntity } from "@/types/base"
import {
  ApplicationStatus,
  type HrRecruitmentApplicationDetail,
} from "@/types/hr-recruitment"

const CandidatePdfPreview = dynamic(
  () => import("./candidate-pdf-preview"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg border bg-background text-muted-foreground">
        Đang tải trình xem CV...
      </div>
    ),
  }
)

interface CandidateDetailDrawerProps {
  applicationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatMatchScore = (value: number | null) => {
  if (value === null) {
    return "Chưa có"
  }

  return `${value}%`
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: unknown } } }
    ).response

    if (typeof response?.data?.message === "string") {
      return response.data.message
    }
  }

  return "Không thể tải chi tiết ứng viên."
}

const getInitials = (name: string | null | undefined) => {
  if (!name) {
    return "UV"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

const statusOptions = [
  { label: "Đang chờ", value: ApplicationStatus.Pending },
  { label: "Đã từ chối", value: ApplicationStatus.Rejected },
  { label: "Đã chấp nhận", value: ApplicationStatus.Accepted },
] as const

const getStatusLabel = (status: ApplicationStatus | null | undefined) =>
  statusOptions.find((option) => option.value === status)?.label ?? "Chưa có"

function CandidateInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="[&_svg]:size-4">{icon}</span>
        {label}
      </div>
      <div className="truncate text-right text-foreground">{value}</div>
    </div>
  )
}

export default function CandidateDetailDrawer({
  applicationId,
  open,
  onOpenChange,
}: CandidateDetailDrawerProps) {
  const queryClient = useQueryClient()
  const { data, error, isFetching, isLoading } =
    useHrRecruitmentApplicationDetailQuery(applicationId ?? "", open)
  const updateStatusMutation = useUpdateApplicationStatusMutation()

  const detail = data?.data
  const [draftStatusState, setDraftStatusState] = React.useState<{
    applicationId: string
    status: ApplicationStatus
  } | null>(null)
  const hasMatchingDraftStatus =
    draftStatusState !== null &&
    draftStatusState.applicationId === detail?.applicationId
  const draftStatus = hasMatchingDraftStatus
    ? draftStatusState.status
    : (detail?.status ?? undefined)
  const hasStatusChange =
    Boolean(detail && draftStatus) && draftStatus !== detail?.status

  const handleClose = () => onOpenChange(false)
  const handleStatusChange = (status: string) => {
    if (!detail) {
      return
    }

    setDraftStatusState({
      applicationId: detail.applicationId,
      status: status as ApplicationStatus,
    })
  }
  const handleSaveStatus = async () => {
    if (!detail || !draftStatus || draftStatus === detail.status) {
      return
    }

    const detailQueryKey = hrRecruitmentQueryKeys.applicationDetail(
      detail.applicationId
    )
    await queryClient.cancelQueries({ queryKey: detailQueryKey })

    const previousDetail = queryClient.getQueryData<
      ResponseEntity<HrRecruitmentApplicationDetail>
    >(detailQueryKey)

    queryClient.setQueryData<ResponseEntity<HrRecruitmentApplicationDetail>>(
      detailQueryKey,
      (current) =>
        current?.data
          ? {
              ...current,
              data: {
                ...current.data,
                status: draftStatus,
              },
            }
          : current
    )

    updateStatusMutation.mutate(
      {
        applicationId: detail.applicationId,
        payload: { status: draftStatus },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Cập nhật trạng thái thành công")
        },
        onError: (mutationError) => {
          queryClient.setQueryData(detailQueryKey, previousDetail)
          setDraftStatusState(
            previousDetail?.data?.status
              ? {
                  applicationId: detail.applicationId,
                  status: previousDetail.data.status,
                }
              : null
          )
          toast.error(getErrorMessage(mutationError))
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: hrRecruitmentQueryKeys.all,
          })
        },
      }
    )
  }

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={onOpenChange}
      dismissible={false}
    >
      <DrawerContent className="inset-0 h-svh w-screen max-w-none p-0 before:inset-0 before:rounded-none before:border-0 data-[vaul-drawer-direction=right]:w-screen data-[vaul-drawer-direction=right]:sm:max-w-none">
        <DrawerHeader className="flex-row items-center justify-between border-b px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              {getInitials(detail?.candidateName)}
            </div>
            <div className="min-w-0">
              <DrawerTitle className="truncate">
                {detail?.candidateName ?? "Chi tiết ứng viên"}
              </DrawerTitle>
              <DrawerDescription>
                Hồ sơ ứng tuyển
                {detail?.applicationId ? ` · #${detail.applicationId}` : ""}
              </DrawerDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            onClick={handleClose}
          >
            <XIcon />
            <span className="sr-only">Đóng</span>
          </Button>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {(isLoading || isFetching) && !detail ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Đang tải chi tiết ứng viên...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {getErrorMessage(error)}
            </div>
          ) : detail ? (
            <ResizablePanelGroup
              className="min-h-0 items-stretch"
            >
              <ResizablePanel
                defaultSize={48}
                minSize={30}
                className="pr-3"
              >
                <div className="space-y-6">
                  <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Thông tin ứng viên
                    </h2>
                    <div className="overflow-hidden rounded-lg border">
                      <CandidateInfoRow
                        icon={<UserIcon />}
                        label="Họ và tên"
                        value={detail.candidateName ?? "Chưa có"}
                      />
                      <CandidateInfoRow
                        icon={<PhoneIcon />}
                        label="Số điện thoại"
                        value={detail.phone ?? "Chưa có"}
                      />
                      <CandidateInfoRow
                        icon={<MailIcon />}
                        label="Email"
                        value={detail.email ?? "Chưa có"}
                      />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Đánh giá tham khảo từ AI
                    </h2>
                    <div className="rounded-lg border p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <SparklesIcon className="size-4" />
                          Mức độ phù hợp
                        </div>
                        {detail.matchScore !== null ? (
                          <Badge variant="secondary">Phù hợp</Badge>
                        ) : null}
                      </div>
                      <div className="mt-6 text-4xl font-semibold">
                        {formatMatchScore(detail.matchScore)}
                      </div>
                      <Progress
                        value={detail.matchScore ?? 0}
                        className="mt-4"
                      />
                      <div className="mt-5 border-t pt-5">
                        <h3 className="font-semibold">Lý do phù hợp</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">
                          {detail.aiSuggestion ?? "Chưa có đánh giá từ AI."}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Thư giới thiệu
                    </h2>
                    {detail.coverLetter ? (
                      <div
                        className="min-h-40 rounded-lg border p-5 leading-7 text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: detail.coverLetter }}
                      />
                    ) : (
                      <div className="min-h-40 rounded-lg border p-5 leading-7 text-muted-foreground">
                        Ứng viên chưa gửi thư giới thiệu.
                      </div>
                    )}
                  </section>
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="mx-3 w-3 bg-transparent before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border"
              />

              <ResizablePanel
                defaultSize={52}
                minSize={35}
                className="pl-3"
              >
                <section className="space-y-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Xem trước CV
                  </h2>
                  <div className="overflow-hidden rounded-lg border">
                    {detail.fileUrl ? (
                      <CandidatePdfPreview
                        key={detail.fileUrl}
                        fileUrl={detail.fileUrl}
                      />
                    ) : (
                      <div className="flex min-h-80 items-center justify-center bg-muted/20 text-muted-foreground">
                        Không có CV để xem trước.
                      </div>
                    )}
                  </div>
                </section>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Chọn một ứng viên để xem chi tiết.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
          <div>
            <div>Trạng thái hồ sơ</div>
            <div className="text-muted-foreground">
              Hiện tại: {getStatusLabel(detail?.status)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={draftStatus}
              onValueChange={handleStatusChange}
              disabled={!detail || updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent align="end">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSaveStatus}
              disabled={!hasStatusChange || updateStatusMutation.isPending}
            >
              <SaveIcon />
              Lưu thay đổi
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
