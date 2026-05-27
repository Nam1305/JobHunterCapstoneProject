"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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

export function AccountInformationForm() {
  const { user } = useCurrentUser()

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
    void values
    form.clearErrors("root")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
        <CardDescription>
          Cập nhật thông tin cá nhân và thay đổi mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <Button type="submit" size="lg" className="mt-4 w-full">
              Lưu thay đổi
            </Button>

            {form.formState.errors.root?.message ? (
              <p className="text-center text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
