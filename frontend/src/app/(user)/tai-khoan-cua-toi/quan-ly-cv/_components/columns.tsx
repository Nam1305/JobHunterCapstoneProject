import type { ColumnDef } from "@tanstack/react-table"
import { CalendarIcon, DownloadIcon, Trash2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Resume } from "@/types/candidate"

export const columns: ColumnDef<Resume>[] = [
  {
    accessorKey: "fileName",
    header: "TÊN FILE CV",
    cell: ({ row }) => (
      <span className="font-medium text-foreground block max-w-[300px] truncate md:max-w-[400px]">
        {row.original.fileName || "Tên file không xác định"}
      </span>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "NGÀY TẢI LÊN",
    cell: ({ row }) => {
      const dateStr = row.original.createdDate
      if (!dateStr) return <span className="text-muted-foreground">-</span>

      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return <span className="text-muted-foreground">{dateStr}</span>

      const formatted = date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      return (
        <span className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="size-4 shrink-0" />
          {formatted}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "HÀNH ĐỘNG",
    cell: ({ row, table }) => {
      const resume = row.original
      const meta = table.options.meta as {
        onDownload?: (resume: Resume) => void
        onDelete?: (resume: Resume) => void
        deletingId?: string | null
      } | undefined

      const isDeleting = meta?.deletingId === resume.id

      return (
        <div className="flex items-center gap-2">
          {resume.fileUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => meta?.onDownload?.(resume)}
              disabled={isDeleting}
              title="Tải xuống / Xem CV"
            >
              <DownloadIcon className="size-4" />
              <span className="sr-only">Tải xuống</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-500 hover:text-red-600"
            onClick={() => meta?.onDelete?.(resume)}
            disabled={isDeleting}
            title="Xóa CV"
          >
            {isDeleting ? (
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            <span className="sr-only">Xóa CV</span>
          </Button>
        </div>
      )
    },
  },
]
