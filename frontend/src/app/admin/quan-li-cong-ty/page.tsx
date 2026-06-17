"use client"

import type { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"
import { useState } from "react"

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
import { CompanyRegistrationRequest } from "@/types/company"

import { CompanyRequestTable } from "./_components/company-table"
import { INITIAL_MOCK_DATA } from "./_components/mock-data"
import { CompanyRequestDetailModal } from "./_components/company-request-detail-modal"

export default function CompanyManagementPage() {
  const [data, setData] = useState<CompanyRegistrationRequest[]>(INITIAL_MOCK_DATA)
  const [statusFilter, setStatusFilter] = useState<"tất cả" | "chờ xét duyệt" | "đã duyệt">("tất cả")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [requestToApprove, setRequestToApprove] = useState<CompanyRegistrationRequest | null>(null)
  const [viewingRequest, setViewingRequest] = useState<CompanyRegistrationRequest | null>(null)

  const handleApprove = (request: CompanyRegistrationRequest) => {
    setRequestToApprove(request)
  }

  const handleView = (request: CompanyRegistrationRequest) => {
    setViewingRequest(request)
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
  const pendingCount = data.filter((item) => item.status === "chờ xét duyệt").length
  const approvedCount = data.filter((item) => item.status === "đã duyệt").length

  // Filter by status processing
  const filteredData = data.filter((item) => {
    return statusFilter === "tất cả" || item.status === statusFilter
  })

  // Paged Data processing
  const paginatedData = filteredData.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize
  )

  const totalCount = filteredData.length
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize)

  // Reset page index on filter change
  const handleStatusFilterChange = (value: "tất cả" | "chờ xét duyệt" | "đã duyệt") => {
    setStatusFilter(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <>
      <CompanyRequestDetailModal
        key={viewingRequest?.id || "empty"}
        open={Boolean(viewingRequest)}
        onOpenChange={(open) => {
          if (!open) setViewingRequest(null)
        }}
        request={viewingRequest}
        onApprove={(request) => {
          setViewingRequest(null)
          handleApprove(request)
        }}
      />

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

