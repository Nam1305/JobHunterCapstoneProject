import type { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, ExternalLinkIcon, EyeIcon, Loader2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CompanyRegistrationRequest } from "@/types/company";

export const columns: ColumnDef<CompanyRegistrationRequest>[] = [
  {
    accessorKey: "hrName",
    header: "Tên HR",
    cell: ({ row }) => <span className="font-medium">{row.original.hrName}</span>,
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "companyName",
    header: "Tên công ty",
    cell: ({ row }) => <span>{row.original.companyName}</span>,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const url = row.original.websiteUrl
      const fullUrl = url.startsWith("http") ? url : `https://${url}`
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:underline"
        >
          {url}
          <ExternalLinkIcon className="size-3" />
        </a>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isApproved = row.original.status === "approved" || row.original.status === "đã duyệt"
      return (
        <Badge
          variant={isApproved ? "default" : "outline"}
          className="px-2"
        >
          {isApproved ? "Đã duyệt" : "Chờ xét duyệt"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }) => {
      const request = row.original
      const isApproved = request.status === "approved" || request.status === "đã duyệt"
      const meta = table.options.meta as {
        onApprove?: (request: CompanyRegistrationRequest) => void
        onView?: (request: CompanyRegistrationRequest) => void
        approvingId?: string | null
      } | undefined

      const isApproving = meta?.approvingId === request.id
      const isAnyApproving = !!meta?.approvingId

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
            onClick={() => meta?.onView?.(request)}
            disabled={isAnyApproving}
            title="Xem chi tiết"
          >
            <EyeIcon className="size-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
          {!isApproved && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-500 hover:text-emerald-600"
              onClick={() => meta?.onApprove?.(request)}
              disabled={isAnyApproving}
              title="Duyệt"
            >
              {isApproving ? (
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <CheckIcon className="size-4" />
              )}
              <span className="sr-only">Duyệt</span>
            </Button>
          )}
        </div>
      )
    },
  },
]
