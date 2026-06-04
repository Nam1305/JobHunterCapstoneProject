"use client"

import * as React from "react"
import Link from "next/link"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

type JobPostingStatus = "open" | "closed"

interface JobPosting {
  id: string
  title: string
  createdAt: string
  expiredAt: string
  updatedAt: string
  status: JobPostingStatus
  applicantCount: number
}

const jobPostings: JobPosting[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    createdAt: "10/01/2025",
    expiredAt: "30/06/2025",
    updatedAt: "01/05/2025",
    status: "open",
    applicantCount: 12,
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    createdAt: "01/02/2025",
    expiredAt: "15/05/2025",
    updatedAt: "20/04/2025",
    status: "closed",
    applicantCount: 8,
  },
  {
    id: "product-manager",
    title: "Product Manager",
    createdAt: "05/03/2025",
    expiredAt: "01/07/2025",
    updatedAt: "10/05/2025",
    status: "open",
    applicantCount: 5,
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    createdAt: "20/01/2025",
    expiredAt: "30/04/2025",
    updatedAt: "28/04/2025",
    status: "closed",
    applicantCount: 20,
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    createdAt: "01/04/2025",
    expiredAt: "01/08/2025",
    updatedAt: "15/05/2025",
    status: "open",
    applicantCount: 3,
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    createdAt: "15/02/2025",
    expiredAt: "01/06/2025",
    updatedAt: "02/05/2025",
    status: "open",
    applicantCount: 7,
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    createdAt: "20/03/2025",
    expiredAt: "31/05/2025",
    updatedAt: "18/05/2025",
    status: "closed",
    applicantCount: 11,
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    createdAt: "10/04/2025",
    expiredAt: "01/09/2025",
    updatedAt: "12/05/2025",
    status: "open",
    applicantCount: 6,
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    createdAt: "18/04/2025",
    expiredAt: "18/08/2025",
    updatedAt: "19/05/2025",
    status: "open",
    applicantCount: 9,
  },
  {
    id: "hr-specialist",
    title: "HR Specialist",
    createdAt: "22/04/2025",
    expiredAt: "22/07/2025",
    updatedAt: "22/05/2025",
    status: "closed",
    applicantCount: 14,
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    createdAt: "25/04/2025",
    expiredAt: "25/08/2025",
    updatedAt: "25/05/2025",
    status: "open",
    applicantCount: 4,
  },
  {
    id: "system-admin",
    title: "System Administrator",
    createdAt: "28/04/2025",
    expiredAt: "28/07/2025",
    updatedAt: "28/05/2025",
    status: "closed",
    applicantCount: 10,
  },
]

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
      <span className="text-muted-foreground">{row.original.createdAt}</span>
    ),
  },
  {
    accessorKey: "expiredAt",
    header: "Ngày hết hạn",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.expiredAt}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.updatedAt}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isOpen = row.original.status === "open"

      return (
        <Badge variant={isOpen ? "default" : "secondary"}>
          {isOpen ? "Đang mở" : "Đã đóng"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "applicantCount",
    header: () => <div className="text-right">Số ứng viên</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.applicantCount}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Hành động</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href={`/hr/dang-tin-tuyen-dung/${row.original.id}/chinh-sua`}>
            <EyeIcon />
            <span className="sr-only">Xem {row.original.title}</span>
          </Link>
        </Button>
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
  const [status, setStatus] = React.useState("all")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const filteredData = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return jobPostings.filter((posting) => {
      const matchesSearch = posting.title.toLowerCase().includes(normalizedSearch)
      const matchesStatus = status === "all" || posting.status === status

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const totalCount = filteredData.length
  const pageIndex = table.getState().pagination.pageIndex

  React.useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }, [search, status])

  return (
    <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lí tin tuyển dụng
          </h1>
          <p className="text-sm text-muted-foreground">
            {jobPostings.length} tin tuyển dụng
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
        <Select value={status} onValueChange={setStatus}>
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
            {table.getRowModel().rows.length ? (
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
            Trang {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount() || 1}
          </div>
          <Button
            variant="outline"
            className="hidden size-8 p-0 md:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon />
            <span className="sr-only">Đến trang đầu</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
            Trước
          </Button>
          {Array.from({ length: table.getPageCount() || 1 }, (_, index) => (
            <Button
              key={index}
              variant={pageIndex === index ? "default" : "outline"}
              size="icon"
              className="size-9"
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Tiếp
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 md:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon />
            <span className="sr-only">Đến trang cuối</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
