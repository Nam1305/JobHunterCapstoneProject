"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  useCreateBranch,
  useDeleteBranch,
  useGetBranches,
  useUpdateBranch,
} from "@/api/hrbranch.api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CompanyBranchRequestDto } from "@/types/company"

const COMPANY_BRANCHES_QUERY_KEY = ["companyBranches"]
const BRANCH_OPTIONS_QUERY_KEY = ["branches"]

const branchFormSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên chi nhánh"),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().trim().min(1, "Vui lòng nhập thành phố"),
})

type BranchFormValues = z.infer<typeof branchFormSchema>

const defaultBranchFormValues: BranchFormValues = {
  name: "",
  address: "",
  city: "",
}

function toBranchFormValues(
  branch: CompanyBranchRequestDto | null
): BranchFormValues {
  return {
    name: branch?.name ?? "",
    address: branch?.address ?? "",
    city: branch?.city ?? "",
  }
}

function invalidateBranchQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({
    queryKey: COMPANY_BRANCHES_QUERY_KEY,
  })
  void queryClient.invalidateQueries({
    queryKey: BRANCH_OPTIONS_QUERY_KEY,
  })
}

function BranchDialogForm({
  branch,
  onOpenChange,
}: {
  branch: CompanyBranchRequestDto | null
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const isSubmitting = createBranch.isPending || updateBranch.isPending
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: defaultBranchFormValues,
  })

  useEffect(() => {
    form.reset(toBranchFormValues(branch))
  }, [branch, form])

  function handleSubmit(values: BranchFormValues) {
    form.clearErrors("root")

    if (branch) {
      updateBranch.mutate(
        {
          id: branch.id,
          branchData: values,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message || "Cập nhật chi nhánh thành công")
            invalidateBranchQueries(queryClient)
            onOpenChange(false)
          },
          onError: (error) => {
            const message =
              error.response?.data.message || "Không thể cập nhật chi nhánh"

            form.setError("root", { message })
            toast.error(message)
          },
        }
      )
      return
    }

    createBranch.mutate(
      {
        branchData: values,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Thêm chi nhánh thành công")
          invalidateBranchQueries(queryClient)
          onOpenChange(false)
        },
        onError: (error) => {
          const message =
            error.response?.data.message || "Không thể thêm chi nhánh"

          form.setError("root", { message })
          toast.error(message)
        },
      }
    )
  }

  function handleCancel() {
    form.reset(toBranchFormValues(branch))
    onOpenChange(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <fieldset
          className="space-y-4 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="branch-name">Tên chi nhánh</FormLabel>
                <FormControl>
                  <Input
                    id="branch-name"
                    placeholder="VD: Chi nhánh Hà Nội"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="branch-address">Địa chỉ</FormLabel>
                <FormControl>
                  <Input
                    id="branch-address"
                    placeholder="Số nhà, tên đường, phường/quận"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="branch-city">Thành phố</FormLabel>
                <FormControl>
                  <Input id="branch-city" placeholder="VD: Hà Nội" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message ? (
            <p className="text-center text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </fieldset>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
            Lưu
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

function DeleteBranchButton({ branch }: { branch: CompanyBranchRequestDto }) {
  const queryClient = useQueryClient()
  const deleteBranch = useDeleteBranch()

  function handleDeleteBranch() {
    deleteBranch.mutate(
      { id: branch.id },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Xóa chi nhánh thành công")
          invalidateBranchQueries(queryClient)
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message || "Không thể xóa chi nhánh"
          )
        },
      }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-destructive"
          disabled={deleteBranch.isPending}
        >
          {deleteBranch.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Trash2Icon />
          )}
          <span className="sr-only">Xóa {branch.name}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa chi nhánh?</AlertDialogTitle>
          <AlertDialogDescription>
            Chi nhánh {branch.name} sẽ bị xóa khỏi danh sách công ty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBranch.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteBranch.isPending}
            onClick={handleDeleteBranch}
          >
            {deleteBranch.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function CompanyBranch() {
  const { data: branchesResponse, isError, isLoading } = useGetBranches()
  const branches = branchesResponse?.data ?? []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] =
    useState<CompanyBranchRequestDto | null>(null)

  function handleOpenChange(open: boolean) {
    setDialogOpen(open)

    if (!open) {
      setSelectedBranch(null)
    }
  }

  function openCreateDialog() {
    setSelectedBranch(null)
    setDialogOpen(true)
  }

  function openEditDialog(branch: CompanyBranchRequestDto) {
    setSelectedBranch(branch)
    setDialogOpen(true)
  }

  return (
    <section className="flex w-full flex-1 flex-col gap-6 md:gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-base font-semibold">Danh sách chi nhánh</p>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Đang tải chi nhánh" : `${branches.length} chi nhánh`}
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="min-w-36"
          onClick={openCreateDialog}
        >
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
                <TableCell>{branch.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {branch.address}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {branch.city}
                </TableCell>
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
                    <DeleteBranchButton branch={branch} />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    Đang tải danh sách chi nhánh
                  </div>
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && !isError && branches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Chưa có chi nhánh nào
                </TableCell>
              </TableRow>
            ) : null}

            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-destructive"
                >
                  Không thể tải danh sách chi nhánh
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {selectedBranch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
            </DialogTitle>
          </DialogHeader>
          <BranchDialogForm
            branch={selectedBranch}
            onOpenChange={handleOpenChange}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
