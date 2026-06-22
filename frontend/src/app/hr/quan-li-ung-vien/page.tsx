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
  EyeIcon,
} from "lucide-react"

import { useHrRecruitmentCandidatesQuery } from "@/api/hr-recruitment.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import CandidateDetailDrawer from "./_components/candidate-detail-drawer"
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
