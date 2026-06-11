"use client"

import * as React from "react"
import Link from "next/link"
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
  LockIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { useJobPostingsQuery, type getJobPostingsParams } from "@/api/hrjob.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { JobPosting } from "@/types/job"

type JobPostingStatusFilter = "all" | "open" | "closed"

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("vi-VN").format(date)
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

  return "Không thể tải danh sách tin tuyển dụng."
}

const columns: ColumnDef<JobPosting>[] = [
  {
    accessorKey: "title",
    header: "Tên công việc",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "expiredAt",
    header: "Ngày hết hạn",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.expiredAt)}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isOpen = row.original.status === "Open"

      return (
        <Badge variant={isOpen ? "default" : "secondary"}>
          {isOpen ? "Đang mở" : "Đã đóng"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "applicationCount",
    header: () => <div className="text-right">Số ứng viên</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.applicationCount}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Hành động</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href={`/hr/dang-tin-tuyen-dung/${row.original.id}/chinh-sua`}>
            <PencilIcon />
            <span className="sr-only">Sửa {row.original.title}</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive"
        >
          <LockIcon />
          <span className="sr-only">Đóng {row.original.title}</span>
        </Button>
      </div>
    ),
    enableHiding: false,
  },
]

export default function JobPostingPage() {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [status, setStatus] = React.useState<JobPostingStatusFilter>("all")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [search])

  const queryParams = React.useMemo<getJobPostingsParams>(
    () => ({
      search: debouncedSearch.trim() || undefined,
      status:
        status === "all" ? undefined : status === "open" ? "Open" : "Closed",
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
    [debouncedSearch, pagination.pageIndex, pagination.pageSize, status]
  )

  const { data, error, isFetching, isLoading } =
    useJobPostingsQuery(queryParams)

  const pageData = data?.data
  const jobPostings = pageData?.items ?? []
  const totalCount = pageData?.totalCount ?? 0
  const pageCount = pageData?.totalPage ?? 0

  const table = useReactTable({
    data: jobPostings,
    columns,
    state: {
      pagination,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  const pageIndex = table.getState().pagination.pageIndex

  React.useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [debouncedSearch, status])

  return (
    <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lí tin tuyển dụng
          </h1>
          <p className="text-sm text-muted-foreground">
            {isFetching ? "Đang tải..." : `${totalCount} tin tuyển dụng`}
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/hr/dang-tin-tuyen-dung/tao-moi">
            <PlusIcon />
            Tạo tin mới
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            className="pl-9"
            placeholder="Tìm theo tên công việc..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as JobPostingStatusFilter)
          }
        >
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="open">Đang mở</SelectItem>
            <SelectItem value="closed">Đã đóng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải tin tuyển dụng...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có tin tuyển dụng.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Tổng cộng {totalCount} kết quả.
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <Label htmlFor="job-posting-rows-per-page" className="text-sm">
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
            >
              <SelectTrigger
                id="job-posting-rows-per-page"
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
          <div className="text-sm font-medium">
            Trang {pageIndex + 1} / {pageCount}
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
    </div>
  )
}
