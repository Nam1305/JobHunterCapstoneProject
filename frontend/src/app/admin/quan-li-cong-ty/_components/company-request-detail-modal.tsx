"use client"

import * as React from "react"
import { CheckIcon, ExternalLinkIcon, SearchIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { CompanyRegistrationRequest } from "@/types/company"
import { useCompanyRegistrationRequestDetails, useCheckTaxCodeMutation } from "@/api/admincompany.api"
import { toast } from "sonner"

interface CompanyRequestDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CompanyRegistrationRequest | null
  onApprove: (request: CompanyRegistrationRequest) => void
}

export function CompanyRequestDetailModal({
  open,
  onOpenChange,
  request,
  onApprove,
}: CompanyRequestDetailModalProps) {
  const { data: response, isLoading: loading } = useCompanyRegistrationRequestDetails(
    open && request ? request.id : null
  )
  const detail = response?.data ?? null

  const taxMutation = useCheckTaxCodeMutation()

  const handleCheckTaxCode = () => {
    if (!detail?.taxCode) return
    taxMutation.mutate(detail.taxCode, {
      onSuccess: (res) => {
        toast.success(res.message || "Đã lấy thông tin thuế thành công.")
      },
      onError: (err) => {
        const message = err.response?.data?.message || "Không tìm thấy thông tin thuế cho mã số thuế này."
        toast.error(message)
      },
    })
  }

  if (!request) return null

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateStr
    }
  }

  const isApproved = request.status === "approved" || request.status === "đã duyệt"

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      taxMutation.reset()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl gap-0 p-0">
        <DialogHeader className="flex-row items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Chi tiết yêu cầu đăng ký
            </DialogTitle>
            {!loading && detail && (
              <Badge
                variant={isApproved ? "default" : "secondary"}
                className="px-2.5 py-0.5 rounded-full font-medium"
              >
                {detail.status === "approved" || detail.status === "đã duyệt" ? "Đã duyệt" : "Chờ duyệt"}
              </Badge>
            )}
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="space-y-6 py-4">
            {/* Skeleton: Two-column layout */}
            <div className="flex gap-6">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <Skeleton className="w-px self-stretch" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Separator />
            <div className="space-y-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : (
          detail && (
            <div className="space-y-6">
              {/* Two-column section: HR info | Company info */}
              <div className="flex gap-6">
                {/* LEFT COLUMN: Thông tin HR */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Thông tin HR
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Họ tên</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{detail.hrName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Email</span>
                      <p className="text-sm font-semibold text-zinc-950 break-all dark:text-zinc-50">{detail.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Số điện thoại</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{detail.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Ngày gửi</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {formatDate(detail.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* <Separator orientation="vertical" /> */}

                {/* RIGHT COLUMN: Thông tin công ty */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Thông tin công ty
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Tên công ty</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {detail.companyName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Ngành nghề</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {detail.companyType}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Quốc gia</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {detail.country}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Quy mô</span>
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {detail.teamSize}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Website</span>
                      <div>
                        <a
                          href={detail.websiteUrl.startsWith("http") ? detail.websiteUrl : `https://${detail.websiteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
                        >
                          {detail.websiteUrl}
                          <ExternalLinkIcon className="size-3.5 text-zinc-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TAX CODE SECTION — full width */}
              {detail.taxCode && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Mã số thuế
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {detail.taxCode}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={taxMutation.isPending}
                        onClick={handleCheckTaxCode}
                        className="h-7 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 border-zinc-200 dark:border-zinc-800"
                      >
                        {taxMutation.isPending ? (
                          <>
                            <Loader2Icon className="mr-1 h-3.5 w-3.5 animate-spin" />
                            Đang tra cứu...
                          </>
                        ) : (
                          <>
                            <SearchIcon className="mr-1 h-3.5 w-3.5" />
                            Kiểm tra thông tin thuế
                          </>
                        )}
                      </Button>
                    </div>

                    {taxMutation.data?.data && (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 space-y-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          <span>Thông tin Tổng cục Thuế</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                          >
                            {taxMutation.data.data.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {taxMutation.data.data.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Địa chỉ: {taxMutation.data.data.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* COMPANY DESCRIPTION — full width, read-only HTML card */}
              {detail.overview && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Giới thiệu chung về công ty
                    </h3>
                    <div
                      className="prose prose-sm prose-zinc max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:prose-invert dark:border-zinc-800 dark:bg-zinc-900/50"
                      dangerouslySetInnerHTML={{ __html: detail.overview }}
                    />
                  </div>
                </>
              )}

            </div>
          )
        )}
        </ScrollArea>

        {/* Sticky Footer */}
        {!loading && detail && !isApproved && (
          <div className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <Button
              onClick={() => onApprove(detail)}
              className="flex items-center gap-2 px-6 py-2 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <CheckIcon className="size-4" />
              Chấp nhận
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
