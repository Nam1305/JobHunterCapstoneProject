"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/auth/google-icon";
import { useLogin } from "@/api/auth.api";
import { fetchCurrentUser } from "@/store/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal, openRegisterModal } from "@/store/modal.slice";

const formSchema = z.object({
  email: z.email("Vui lòng nhập địa chỉ email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginModal() {
  const dispatch = useAppDispatch();
  const openModal = useAppSelector((state) => state.modal.openModal);
  const loginMutation = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: async () => {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
          dispatch(closeModal());
          form.reset();
          toast.success("Đăng nhập thành công");
        } catch {
          const message = "Đăng nhập thành công nhưng không thể tải thông tin tài khoản.";

          form.setError("root", {
            message,
          });
          toast.error(message);
        }
      },
      onError: (error) => {
        const message =
          error.response?.data.message ||
          "Đăng nhập thất bại. Vui lòng thử lại.";

        form.setError("root", {
          message,
        });
        toast.error(message);
      },
    });
  };

  return (
    <Dialog
      open={openModal === "login"}
      onOpenChange={(open) => !open && dispatch(closeModal())}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chào mừng trở lại</DialogTitle>
          <DialogDescription>
            Đăng nhập vào tài khoản của bạn để tiếp tục
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ten@example.com"
                      autoComplete="email"
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
                      placeholder="Nhập mật khẩu của bạn"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            {form.formState.errors.root?.message ? (
              <p className="text-center text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-popover px-2 text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full">
              <GoogleIcon />
              Đăng nhập với Google
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => dispatch(openRegisterModal())}
          >
            Đăng ký
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
