"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DownloadIcon,
  EyeIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

import {
  useHrRecruitmentApplicationDetailQuery,
  useHrRecruitmentCandidatesQuery,
} from "@/api/hr-recruitment.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ApplicationStatus,
  type HrRecruitmentCandidate,
} from "@/types/hr-recruitment"
import CandidateManagementPanel from "./_components/candidate-management-panel"

type CandidateStatusFilter = "all" | ApplicationStatus

const candidateStatusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang chờ", value: ApplicationStatus.Pending },
  { label: "Đã từ chối", value: ApplicationStatus.Rejected },
  { label: "Đã chấp nhận", value: ApplicationStatus.Accepted },
] as const

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

  return "Không thể tải danh sách ứng viên."
}

const getCandidateColumns = (
  onOpenDetail: (applicationId: string) => void
): ColumnDef<HrRecruitmentCandidate>[] => [
  {
    accessorKey: "candidateName",
    header: "Ứng viên",
    cell: ({ row }) => row.original.candidateName ?? "Chưa có tên",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.original.phone ?? "Chưa có",
  },
  {
    accessorKey: "matchScore",
    header: "Match score",
    cell: ({ row }) => formatMatchScore(row.original.matchScore),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.status ?? "Chưa có"}</Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Chi tiết</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onOpenDetail(row.original.applicationId)}
        >
          <EyeIcon />
          <span className="sr-only">Xem chi tiết ứng viên</span>
        </Button>
      </div>
    ),
    enableHiding: false,
  },
]

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

function CandidateDetailDrawer({
  applicationId,
  open,
  onOpenChange,
}: {
  applicationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data, error, isFetching, isLoading } =
    useHrRecruitmentApplicationDetailQuery(applicationId ?? "", open)

  const detail = data?.data

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
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
          <DrawerClose asChild>
            <Button variant="outline" size="icon" className="size-10">
              <XIcon />
              <span className="sr-only">Đóng</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading || isFetching ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Đang tải chi tiết ứng viên...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {getErrorMessage(error)}
            </div>
          ) : detail ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]">
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
                  <div className="min-h-40 whitespace-pre-line rounded-lg border p-5 leading-7 text-muted-foreground">
                    {detail.coverLetter ?? "Ứng viên chưa gửi thư giới thiệu."}
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Xem trước CV
                </h2>
                <div className="overflow-hidden rounded-lg border">
                  <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <FileTextIcon className="size-4 shrink-0" />
                      <span className="truncate">
                        {detail.fileUrl ? "CV ứng viên" : "Chưa có CV"}
                      </span>
                    </div>
                    {detail.fileUrl ? (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={detail.fileUrl} download>
                            <DownloadIcon />
                            Tải xuống
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={detail.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLinkIcon />
                            Mở rộng
                          </a>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <div className="h-[68vh] bg-muted/20 p-4">
                    {detail.fileUrl ? (
                      <iframe
                        title="Xem trước CV"
                        src={detail.fileUrl}
                        className="h-full w-full rounded-lg border bg-background"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-lg border bg-background text-muted-foreground">
                        Không có CV để xem trước.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
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
              Hiện tại: {detail?.status ?? "Chưa có"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MessageCircleIcon />
              Nhắn tin
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Đóng</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

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

export default function CandidateManagementPage() {
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null)
  const [selectedApplicationId, setSelectedApplicationId] = React.useState<
    string | null
  >(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [status, setStatus] = React.useState<CandidateStatusFilter>("all")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, error, isFetching, isLoading } =
    useHrRecruitmentCandidatesQuery(
      {
        jobId: selectedJobId ?? "",
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
      Boolean(selectedJobId)
    )

  const pageData = data?.data
  const candidates = pageData?.items ?? []
  const totalCount = pageData?.totalCount ?? 0
  const pageCount = pageData?.totalPage ?? 0
  const columns = getCandidateColumns((applicationId) => {
    setSelectedApplicationId(applicationId)
    setDetailOpen(true)
  })

  const table = useReactTable({
    data: candidates,
    columns,
    state: {
      pagination,
    },
    getRowId: (row) => row.applicationId,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  const pageIndex = table.getState().pagination.pageIndex
  const handleSelectedJobIdChange = (jobId: string) => {
    setSelectedJobId(jobId)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }
  const handleStatusChange = (value: string) => {
    setStatus(value as CandidateStatusFilter)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] min-h-0 w-full bg-background text-sm">
        <CandidateManagementPanel
          selectedJobId={selectedJobId}
          onSelectedJobIdChange={handleSelectedJobIdChange}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Danh sách ứng viên
            </h1>
            <p className="text-muted-foreground">
              {!selectedJobId
                ? "Chọn một vị trí để xem ứng viên."
                : isFetching
                  ? "Đang tải..."
                  : `${totalCount} ứng viên`}
            </p>
          </div>

          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={!selectedJobId || isFetching}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Trạng thái CV" />
            </SelectTrigger>
            <SelectContent>
              {candidateStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-h-0 flex-1 overflow-auto rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!selectedJobId ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Chọn một vị trí để xem danh sách ứng viên.
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Đang tải danh sách ứng viên...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {getErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có ứng viên cho vị trí này.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-muted-foreground">
            Tổng cộng {totalCount} kết quả.
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <Label htmlFor="candidate-rows-per-page">
                Số hàng mỗi trang:
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(value),
                  })
                }}
                disabled={!selectedJobId || isFetching}
              >
                <SelectTrigger
                  id="candidate-rows-per-page"
                  size="sm"
                  className="w-20"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[5, 10, 20, 30].map((currentPageSize) => (
                      <SelectItem
                        key={currentPageSize}
                        value={`${currentPageSize}`}
                      >
                        {currentPageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              Trang {selectedJobId ? pageIndex + 1 : 1} /{" "}
              {Math.max(pageCount, 1)}
            </div>
            <Button
              variant="outline"
              className="hidden size-8 p-0 md:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isFetching}
            >
              <ChevronsLeftIcon />
              <span className="sr-only">Đến trang đầu</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isFetching}
            >
              <ChevronLeftIcon />
              Trước
            </Button>
            {Array.from({ length: pageCount }, (_, index) => (
              <Button
                key={index}
                variant={pageIndex === index ? "default" : "outline"}
                size="icon"
                className="size-9"
                onClick={() => table.setPageIndex(index)}
                disabled={isFetching}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isFetching}
            >
              Tiếp
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 p-0 md:flex"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage() || isFetching}
            >
              <ChevronsRightIcon />
              <span className="sr-only">Đến trang cuối</span>
            </Button>
          </div>
        </div>
        </main>
      </div>

      <CandidateDetailDrawer
        applicationId={selectedApplicationId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
