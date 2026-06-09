"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Branch = {
  id: string
  name: string
  address: string
  city: string
}

const branches: Branch[] = [
  {
    id: "head-office",
    name: "Trụ sở chính",
    address: "123 Nguyễn Huệ, Hoàn Kiếm",
    city: "Hà Nội",
  },
  {
    id: "hcm-branch",
    name: "Chi nhánh HCM",
    address: "456 Lê Lợi, Q.1",
    city: "TP. Hồ Chí Minh",
  },
  {
    id: "danang-branch",
    name: "Chi nhánh Đà Nẵng",
    address: "789 Trần Phú, Hải Châu",
    city: "Đà Nẵng",
  },
]

function BranchDialogForm({ branch }: { branch: Branch | null }) {
  return (
    <form className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="branch-name">
          Tên chi nhánh
        </Label>
        <Input
          id="branch-name"
          defaultValue={branch?.name ?? ""}
          placeholder="VD: Chi nhánh Hà Nội"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="branch-address">
          Địa chỉ
        </Label>
        <Input
          id="branch-address"
          defaultValue={branch?.address ?? ""}
          placeholder="Số nhà, tên đường, phường/quận"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="branch-city">
          Thành phố
        </Label>
        <Input
          id="branch-city"
          defaultValue={branch?.city ?? ""}
          placeholder="VD: Hà Nội"
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Hủy
          </Button>
        </DialogClose>
        <Button type="submit" size="lg">
          Lưu
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CompanyBranch() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  function openCreateDialog() {
    setSelectedBranch(null)
    setDialogOpen(true)
  }

  function openEditDialog(branch: Branch) {
    setSelectedBranch(branch)
    setDialogOpen(true)
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-normal">
            Danh sách chi nhánh
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            {branches.length} chi nhánh
          </p>
        </div>
        <Button type="button" size="lg" onClick={openCreateDialog}>
          <PlusIcon />
          Thêm chi nhánh
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Tên chi nhánh</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Thành phố</TableHead>
              <TableHead>
                <div className="flex justify-end">Hành động</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {branch.address}
                  </span>
                </TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEditDialog(branch)}
                    >
                      <PencilIcon />
                      <span className="sr-only">Chỉnh sửa {branch.name}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                    >
                      <Trash2Icon />
                      <span className="sr-only">Xóa {branch.name}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {selectedBranch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
            </DialogTitle>
          </DialogHeader>
          <BranchDialogForm branch={selectedBranch} />
        </DialogContent>
      </Dialog>
    </section>
  )
}