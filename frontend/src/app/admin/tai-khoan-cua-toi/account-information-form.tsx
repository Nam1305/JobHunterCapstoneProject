"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, UploadIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { useUpdateUserMutation } from "@/api/user.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { setUser } from "@/store/auth.slice"
import { useAppDispatch } from "@/store/hooks"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = z
  .object({
    fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.email("Vui lòng nhập địa chỉ email hợp lệ"),
    phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const shouldValidatePassword =
      data.password.length > 0 || data.confirmPassword.length > 0

    if (!shouldValidatePassword) {
      return
    }

    if (data.password.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        path: ["password"],
      })
    }

    if (data.confirmPassword.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng xác nhận mật khẩu",
        path: ["confirmPassword"],
      })
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

function getInitials(name?: string) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function AccountInformationForm() {
  const { user } = useCurrentUser()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const updateUserMutation = useUpdateUserMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!user) {
      return
    }

    form.reset({
      fullName: user.name,
      email: user.email,
      phoneNumber: user.phone ?? "",
      password: "",
      confirmPassword: "",
    })
  }, [form, user])

  const onSubmit = (values: FormValues) => {
    form.clearErrors("root")

    updateUserMutation.mutate(
      {
        name: values.fullName,
        phone: values.phoneNumber,
        password: values.password,
      },
      {
        onSuccess: (response) => {
          if (user) {
            dispatch(
              setUser({
                ...user,
                name: values.fullName,
                phone: values.phoneNumber,
              })
            )
          }

          queryClient.invalidateQueries({ queryKey: ["currentUser"] })
          queryClient.invalidateQueries({ queryKey: ["users"] })
          form.reset({
            ...values,
            password: "",
            confirmPassword: "",
          })
          toast.success(response.message || "Cập nhật tài khoản thành công")
        },
        onError: (error) => {
          const message =
            error.response?.data.message ||
            "Không thể cập nhật tài khoản. Vui lòng thử lại."

          form.setError("root", {
            message,
          })
          toast.error(message)
        },
      }
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="flex flex-col items-center gap-5 text-center">
          <Avatar className="size-32 shadow-sm">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-3xl font-semibold">
              {getInitials(user?.name) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="grid w-full gap-3">
            <Button type="button" variant="outline" size="lg" className="w-full">
              <UploadIcon />
              Tải ảnh lên
            </Button>
            <p className="text-sm leading-6 text-muted-foreground">
              JPG hoặc PNG
              <br />
              Kích thước tối đa: 2MB
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập họ và tên"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Nhập số điện thoại của bạn"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <h2 className="text-base font-semibold">Đổi mật khẩu</h2>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="mt-4 w-full"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>

              {form.formState.errors.root?.message ? (
                <p className="text-center text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              ) : null}
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
