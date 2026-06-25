"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "./columns"
import type { Resume } from "@/types/candidate"

export interface CVTableProps {
  data: Resume[]
  isLoading: boolean
  onDownload: (resume: Resume) => void
  onDelete: (resume: Resume) => void
  deletingId: string | null
}

export function CVTable({
  data,
  isLoading,
  onDownload,
  onDelete,
  deletingId,
}: CVTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onDownload,
      onDelete,
      deletingId,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border/60">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-xs font-semibold text-muted-foreground uppercase">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-48 md:w-64" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty State
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Bạn chưa tải lên CV nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && (
        <div className="text-sm text-muted-foreground px-1">
          {data.length} CV
        </div>
      )}
    </div>
  )
}
