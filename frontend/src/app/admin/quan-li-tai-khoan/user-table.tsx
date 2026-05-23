"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

import { UserModal } from "@/components/dashboard/user-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import type { UpdateUserRequest, Userinfo } from "@/types/user"

interface UserColumnActions {
  onCreate: () => void
  onUpdate: (user: Userinfo) => void
  onDelete: (user: Userinfo) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function getUserColumns({
  onCreate,
  onUpdate,
  onDelete,
}: UserColumnActions): ColumnDef<Userinfo>[] {
  return [
    {
      accessorKey: "name",
      header: "Người dùng",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex min-w-56 items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name) || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.id}</span>
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => row.original.phone ?? "Chưa cập nhật",
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-2 text-muted-foreground">
          {row.original.role ?? "Chưa phân quyền"}
        </Badge>
      ),
    },
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <span className="block max-w-48 truncate text-muted-foreground">
          {row.original.avatar ?? "Không có"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onCreate}
          >
            <PlusIcon />
            <span className="sr-only">Thêm tài khoản</span>
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onUpdate(row.original)}
          >
            <PencilIcon />
            <span className="sr-only">Cập nhật {row.original.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash2Icon />
            <span className="sr-only">Xóa {row.original.name}</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}

export function UserInfoDataTable({ data }: { data: Userinfo[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [modalMode, setModalMode] = React.useState<"create" | "update">(
    "create"
  )
  const [selectedUser, setSelectedUser] = React.useState<Userinfo | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false)

  const handleCreate = React.useCallback(() => {
    setModalMode("create")
    setSelectedUser(null)
    setIsUserModalOpen(true)
  }, [])

  const handleUpdate = React.useCallback((user: Userinfo) => {
    setModalMode("update")
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }, [])

  const handleDelete = React.useCallback((user: Userinfo) => {
    console.log("Delete user", user)
  }, [])

  const handleSubmitUser = React.useCallback(
    (values: UpdateUserRequest) => {
      console.log(`${modalMode} user`, values)
      setIsUserModalOpen(false)
    },
    [modalMode]
  )

  const userColumns = React.useMemo(
    () =>
      getUserColumns({
        onCreate: handleCreate,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
      }),
    [handleCreate, handleDelete, handleUpdate]
  )

  const table = useReactTable({
    data,
    columns: userColumns,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <UserModal
        mode={modalMode}
        open={isUserModalOpen}
        user={selectedUser}
        onOpenChange={setIsUserModalOpen}
        onSubmit={handleSubmitUser}
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lí tài khoản
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý tài khoản người dùng, vai trò và thông tin liên hệ.
          </p>
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
                  <TableCell
                    colSpan={userColumns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Tổng {table.getPrePaginationRowModel().rows.length} tài khoản
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <Label htmlFor="account-rows-per-page" className="text-sm">
                Số hàng mỗi trang:
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger
                  id="account-rows-per-page"
                  size="sm"
                  className="w-20"
                >
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
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeftIcon />
                <span className="sr-only">Đến trang đầu</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon />
                <span className="sr-only">Đến trang trước</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon />
                <span className="sr-only">Đến trang tiếp theo</span>
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
      </div>
    </>
  )
}
