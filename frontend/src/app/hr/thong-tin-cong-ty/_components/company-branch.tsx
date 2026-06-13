"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useState, type ReactNode } from "react"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

function Section({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Card className="gap-5 py-6">
      <CardHeader className="px-5 pb-0 md:px-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 md:px-6">{children}</CardContent>
    </Card>
  )
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
  const branchFormValues: BranchFormValues = {
    name: branch?.name ?? "",
    address: branch?.address ?? "",
    city: branch?.city ?? "",
  }
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: defaultBranchFormValues,
    values: branchFormValues,
  })

  async function handleSubmit(values: BranchFormValues) {
    form.clearErrors("root")

    try {
      if (branch) {
        await updateBranch.mutateAsync({
          id: branch.id,
          branchData: values,
        })
        toast.success("Cập nhật chi nhánh thành công")
      } else {
        await createBranch.mutateAsync({
          branchData: values,
        })
        toast.success("Thêm chi nhánh thành công")
      }

      await queryClient.invalidateQueries({
        queryKey: COMPANY_BRANCHES_QUERY_KEY,
      })
      onOpenChange(false)
    } catch {
      const message = branch
        ? "Không thể cập nhật chi nhánh"
        : "Không thể thêm chi nhánh"

      form.setError("root", { message })
      toast.error(message)
    }
  }

  function handleCancel() {
    form.reset(branchFormValues)
    onOpenChange(false)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <fieldset
          className="space-y-6 disabled:cursor-not-allowed disabled:opacity-70"
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
            <Card>
              <CardContent className="p-5 text-sm text-destructive">
                {form.formState.errors.root.message}
              </CardContent>
            </Card>
          ) : null}
        </fieldset>

        <DialogFooter className="gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-24"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="lg"
            className="min-w-36"
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

  async function handleDeleteBranch() {
    try {
      await deleteBranch.mutateAsync({ id: branch.id })
      toast.success("Xóa chi nhánh thành công")
      await queryClient.invalidateQueries({
        queryKey: COMPANY_BRANCHES_QUERY_KEY,
      })
    } catch {
      toast.error("Không thể xóa chi nhánh")
    }
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
    <section className="flex w-full flex-1 flex-col gap-6 p-4 md:gap-7 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-normal">
            Chi nhánh công ty
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
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

      <Section title="Danh sách chi nhánh">
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
                        <span className="sr-only">
                          Chỉnh sửa {branch.name}
                        </span>
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
      </Section>

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
