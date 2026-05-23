"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { UpdateUserRequest, Userinfo, UserRole } from "@/types/user"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const roleOptions = ["Admin", "HR", "Candidate"] satisfies UserRole[]

const formSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  password: z.string(),
  avatar: z.string(),
  role: z.enum(roleOptions).nullable(),
})

type FormValues = z.infer<typeof formSchema>

type UserModalMode = "create" | "update"

interface UserModalProps {
  mode: UserModalMode
  open: boolean
  user?: Userinfo | null
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (values: UpdateUserRequest) => void
}

function getDefaultValues(user?: Userinfo | null): FormValues {
  return {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    password: "",
    avatar: user?.avatar ?? "",
    role: user?.role ?? null,
  }
}

export function UserModal({
  mode,
  open,
  user,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: UserModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(user),
  })

  React.useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(user))
    }
  }, [form, open, user])

  const handleSubmit = (values: FormValues) => {
    onSubmit?.(values)
  }

  const title = mode === "create" ? "Thêm tài khoản" : "Cập nhật tài khoản"
  const description =
    mode === "create"
      ? "Nhập thông tin người dùng, mật khẩu, avatar và vai trò."
      : "Cập nhật thông tin người dùng, mật khẩu, avatar và vai trò."
  const submitLabel = mode === "create" ? "Thêm" : "Cập nhật"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyen Van An" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="0901234567"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        mode === "create"
                          ? "Nhập mật khẩu"
                          : "Để trống nếu không đổi mật khẩu"
                      }
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    value={field.value ?? "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">Chưa phân quyền</SelectItem>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
