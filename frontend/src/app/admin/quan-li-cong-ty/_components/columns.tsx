import type { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, ExternalLinkIcon, EyeIcon, Loader2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CompanyRegistrationRequest } from "./mock-data"

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
      const url = row.original.website
      const fullUrl = url.startsWith("http") ? url : `https://${url}`
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:underline"
        >
          {url}
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isApproved = row.original.status === "đã duyệt"
      return (
        <Badge
          variant={isApproved ? "default" : "outline"}
          className={
            isApproved
              ? "bg-zinc-900 text-zinc-50 border-transparent dark:bg-zinc-50 dark:text-zinc-900"
              : "border-zinc-300 text-zinc-700 bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:bg-zinc-900/50"
          }
        >
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row, table }) => {
      const request = row.original
      const isApproved = request.status === "đã duyệt"
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
            className="h-8 w-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
            onClick={() => meta?.onView?.(request)}
            disabled={isAnyApproving}
            title="Xem chi tiết"
          >
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
          {!isApproved && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-emerald-600"
              onClick={() => meta?.onApprove?.(request)}
              disabled={isAnyApproving}
              title="Duyệt"
            >
              {isApproving ? (
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Duyệt</span>
            </Button>
          )}
        </div>
      )
    },
  },
]
