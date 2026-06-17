"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

import { columns } from "./columns"
import { CompanyRegistrationRequest } from "@/types/company";

export interface CompanyRequestTableProps {
  data: CompanyRegistrationRequest[]
  pendingCount: number
  approvedCount: number
  statusFilter: "tất cả" | "chờ xét duyệt" | "đã duyệt"
  onStatusFilterChange: (value: "tất cả" | "chờ xét duyệt" | "đã duyệt") => void
  onApprove: (request: CompanyRegistrationRequest) => void
  onView: (request: CompanyRegistrationRequest) => void
  approvingId: string | null
  pagination: PaginationState
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
  pageCount: number
  totalCount: number
}

export function CompanyRequestTable({
  data,
  pendingCount,
  approvedCount,
  statusFilter,
  onStatusFilterChange,
  onApprove,
  onView,
  approvingId,
  pagination,
  onPaginationChange,
  pageCount,
  totalCount,
}: CompanyRequestTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    meta: {
      onApprove,
      onView,
      approvingId,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Yêu cầu đăng ký HR
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi và duyệt thông tin yêu cầu đăng ký HR.
          </p>
        </div>
      </div>

      <div className="flex max-w-xs items-center gap-2">
        <Select
          value={statusFilter}
          disabled={!!approvingId}
          onValueChange={(value) =>
            onStatusFilterChange(value as "tất cả" | "chờ xét duyệt" | "đã duyệt")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tất cả">Tất cả trạng thái</SelectItem>
            <SelectItem value="chờ xét duyệt">Chờ xét duyệt</SelectItem>
            <SelectItem value="đã duyệt">Đã duyệt</SelectItem>
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy yêu cầu phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Tổng {totalCount} yêu cầu
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <Label htmlFor="company-rows-per-page" className="text-sm">
              Số hàng mỗi trang:
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              disabled={!!approvingId}
              onValueChange={(value) => {
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(value),
                })
              }}
            >
              <SelectTrigger id="company-rows-per-page" size="sm" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-medium">
            Trang {table.getState().pagination.pageIndex + 1} / {" "}
            {table.getPageCount() || 1}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden size-8 p-0 md:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || !!approvingId}
            >
              <ChevronsLeftIcon />
              <span className="sr-only">Đến trang đầu</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || !!approvingId}
            >
              <ChevronLeftIcon />
              <span className="sr-only">Đến trang trước</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || !!approvingId}
            >
              <ChevronRightIcon />
              <span className="sr-only">Đến trang tiếp theo</span>
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 p-0 md:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || !!approvingId}
            >
              <ChevronsRightIcon />
              <span className="sr-only">Đến trang cuối</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
