"use client"

import * as React from "react"
import type { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"

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

import { CompanyRequestTable } from "./_components/company-table"
import { INITIAL_MOCK_DATA, type CompanyRegistrationRequest } from "./_components/mock-data"

export default function CompanyManagementPage() {
  const [data, setData] = React.useState<CompanyRegistrationRequest[]>(INITIAL_MOCK_DATA)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"tất cả" | "chờ xét duyệt" | "đã duyệt">("tất cả")
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [approvingId, setApprovingId] = React.useState<string | null>(null)
  const [requestToApprove, setRequestToApprove] = React.useState<CompanyRegistrationRequest | null>(null)

  const handleApprove = (request: CompanyRegistrationRequest) => {
    setRequestToApprove(request)
  }

  const handleView = (request: CompanyRegistrationRequest) => {
    toast.info(`Xem chi tiết yêu cầu của ${request.hrName} (${request.companyName})`)
  }

  const handleConfirmApprove = () => {
    if (!requestToApprove) return
    const targetId = requestToApprove.id
    const targetName = requestToApprove.hrName
    setApprovingId(targetId)
    setRequestToApprove(null)

    // Simulate network delay / submit lock
    setTimeout(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === targetId ? { ...item, status: "đã duyệt" as const } : item
        )
      )
      setApprovingId(null)
      toast.success(`Đã duyệt yêu cầu đăng ký HR cho ${targetName}`)
    }, 1200)
  }

  // Count helper functions on full dataset
  const pendingCount = React.useMemo(
    () => data.filter((item) => item.status === "chờ xét duyệt").length,
    [data]
  )
  const approvedCount = React.useMemo(
    () => data.filter((item) => item.status === "đã duyệt").length,
    [data]
  )

  // Filter & Search processing
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesStatus = statusFilter === "tất cả" || item.status === statusFilter
      const normalizedSearch = search.toLowerCase().trim()
      const matchesSearch =
        normalizedSearch === "" ||
        item.hrName.toLowerCase().includes(normalizedSearch) ||
        item.email.toLowerCase().includes(normalizedSearch) ||
        item.companyName.toLowerCase().includes(normalizedSearch)
      return matchesStatus && matchesSearch
    })
  }, [data, statusFilter, search])

  // Paged Data processing
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

  const totalCount = filteredData.length
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize)

  // Reset page index on search or filter change
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleStatusFilterChange = (value: "tất cả" | "chờ xét duyệt" | "đã duyệt") => {
    setStatusFilter(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <>
      <AlertDialog
        open={Boolean(requestToApprove)}
        onOpenChange={(open) => {
          if (!open) setRequestToApprove(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt yêu cầu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn duyệt yêu cầu đăng ký HR của{" "}
              <strong className="text-foreground">{requestToApprove?.hrName}</strong> thuộc công ty{" "}
              <strong className="text-foreground">{requestToApprove?.companyName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApprove}>Xác nhận duyệt</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <CompanyRequestTable
          data={paginatedData}
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onApprove={handleApprove}
          onView={handleView}
          approvingId={approvingId}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={pageCount}
          totalCount={totalCount}
        />
      </main>
    </>
  )
}
