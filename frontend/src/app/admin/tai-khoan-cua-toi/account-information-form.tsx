"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, UploadIcon } from "lucide-react"
import { useEffect, useRef, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  useUpdateAvatarMutation,
  useUpdateUserMutation,
} from "@/api/user.api"
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
import { fetchCurrentUser, setUser } from "@/store/auth.slice"
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
  const updateAvatarMutation = useUpdateAvatarMutation()
  const avatarInputRef = useRef<HTMLInputElement>(null)

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

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Vui lòng chọn ảnh JPG hoặc PNG")
      event.target.value = ""
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa là 2MB")
      event.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("request", file)

    updateAvatarMutation.mutate(formData, {
      onSuccess: async (response) => {
        await dispatch(fetchCurrentUser()).unwrap()
        queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success(response.message || "Cập nhật ảnh đại diện thành công")
      },
      onError: (error) => {
        const message =
          error.response?.data.message ||
          "Không thể cập nhật ảnh đại diện. Vui lòng thử lại."

        toast.error(message)
      },
      onSettled: () => {
        event.target.value = ""
      },
    })
  }

  return (
  <Card className="w-full border-border/60 shadow-sm">
    <CardContent className="p-6 md:p-8">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Avatar Section */}
        <div className="flex flex-col items-center rounded-2xl border bg-muted/20 p-6 text-center">
          <Avatar className="size-28 border shadow-sm">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}

            <AvatarFallback className="text-2xl font-semibold">
              {getInitials(user?.name) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 space-y-1">
            <h3 className="text-base font-semibold">{user?.name}</h3>

            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>

          <div className="mt-6 w-full">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={updateAvatarMutation.isPending}
              onClick={() => avatarInputRef.current?.click()}
            >
              {updateAvatarMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <UploadIcon />
                  Đổi ảnh đại diện
                </>
              )}
            </Button>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              JPG hoặc PNG
              <br />
              Tối đa 2MB
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="min-w-0">
          <div className="mb-6">
            <CardTitle className="text-2xl">
              Tài khoản của tôi
            </CardTitle>

            <CardDescription className="mt-2">
              Quản lý thông tin cá nhân và bảo mật tài khoản.
            </CardDescription>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Personal Info */}
              <div className="space-y-5">
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
                          className="h-11"
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
                          autoComplete="email"
                          disabled
                          className="h-11 opacity-80"
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
                          placeholder="Nhập số điện thoại"
                          autoComplete="tel"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Section */}
              <div className="rounded-xl border p-5">
                <div className="mb-5">
                  <h2 className="text-base font-semibold">
                    Đổi mật khẩu
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Để trống nếu bạn không muốn thay đổi mật khẩu.
                  </p>
                </div>

                <div className="space-y-5">
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
                            className="h-11"
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
                        <FormLabel>
                          Xác nhận mật khẩu mới
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            autoComplete="new-password"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Root Error */}
              {form.formState.errors.root?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              ) : null}

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="min-w-40"
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </CardContent>
  </Card>
)
}
