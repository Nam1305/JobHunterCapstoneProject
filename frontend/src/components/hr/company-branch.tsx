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
        <Label htmlFor="branch-name" className="text-base font-semibold">
          Tên chi nhánh
        </Label>
        <Input
          id="branch-name"
          defaultValue={branch?.name ?? ""}
          placeholder="VD: Chi nhánh Hà Nội"
          className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="branch-address" className="text-base font-semibold">
          Địa chỉ
        </Label>
        <Input
          id="branch-address"
          defaultValue={branch?.address ?? ""}
          placeholder="Số nhà, tên đường, phường/quận"
          className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="branch-city" className="text-base font-semibold">
          Thành phố
        </Label>
        <Input
          id="branch-city"
          defaultValue={branch?.city ?? ""}
          placeholder="VD: Hà Nội"
          className="h-12 rounded-2xl bg-muted/60 px-4 text-base md:text-base"
        />
      </div>

      <DialogFooter className="pt-4">
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

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[28%] text-base font-semibold">
              Tên chi nhánh
            </TableHead>
            <TableHead className="w-[40%] text-base font-semibold">
              Địa chỉ
            </TableHead>
            <TableHead className="w-[24%] text-base font-semibold">
              Thành phố
            </TableHead>
            <TableHead className="w-[8%] text-right text-base font-semibold">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="py-5 text-base font-semibold">
                {branch.name}
              </TableCell>
              <TableCell className="py-5 text-base font-medium text-muted-foreground">
                {branch.address}
              </TableCell>
              <TableCell className="py-5 text-base font-medium text-muted-foreground">
                {branch.city}
              </TableCell>
              <TableCell className="py-5">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Chỉnh sửa ${branch.name}`}
                    onClick={() => openEditDialog(branch)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Xóa ${branch.name}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
