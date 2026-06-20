"use client"

import type { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

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
import {
  useCompanyRegistrationsQuery,
  useApproveRegistrationMutation,
} from "@/api/admincompany.api"

import { CompanyRequestTable } from "./_components/company-table"
import { CompanyRequestDetailModal } from "./_components/company-request-detail-modal"

export default function CompanyManagementPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<"tất cả" | "chờ xét duyệt" | "đã duyệt">("tất cả")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [requestToApprove, setRequestToApprove] = useState<CompanyRegistrationRequest | null>(null)
  const [viewingRequest, setViewingRequest] = useState<CompanyRegistrationRequest | null>(null)

  // Map local filter state to backend request parameters
  const apiStatus = statusFilter === "chờ xét duyệt" ? "pending" : statusFilter === "đã duyệt" ? "approved" : undefined
  const apiPage = pagination.pageIndex + 1
  const apiLimit = pagination.pageSize

  // Query to fetch company registration requests
  const { data: response } = useCompanyRegistrationsQuery({
    status: apiStatus,
    page: apiPage,
    limit: apiLimit,
  })

  // Mutation to approve registration
  const approveMutation = useApproveRegistrationMutation()

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

    approveMutation.mutate(targetId, {
      onSuccess: (res) => {
        toast.success(res.message || `Đã duyệt yêu cầu đăng ký HR cho ${targetName}`)
        // Invalidate queries to trigger re-fetch/refresh
        queryClient.invalidateQueries({ queryKey: ["admin", "company-registrations"] })
        queryClient.invalidateQueries({ queryKey: ["admin", "company-registration-details", targetId] })
        setRequestToApprove(null)
      },
      onError: (err) => {
        const errMsg = err.response?.data?.message || "Duyệt yêu cầu đăng ký HR thất bại."
        toast.error(errMsg)
        setRequestToApprove(null)
      },
    })
  }

  const handleStatusFilterChange = (value: "tất cả" | "chờ xét duyệt" | "đã duyệt") => {
    setStatusFilter(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const registrations = response?.data?.items ?? []
  const totalCount = response?.data?.totalCount ?? 0
  const pageCount = response?.data?.totalPage ?? 1
  const approvingId = approveMutation.isPending ? approveMutation.variables : null

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
          data={registrations}
          pendingCount={0}
          approvedCount={0}
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
