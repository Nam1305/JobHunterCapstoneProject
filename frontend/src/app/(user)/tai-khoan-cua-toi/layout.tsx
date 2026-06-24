"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useRef, type ChangeEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  FileTextIcon,
  BriefcaseIcon,
  UserIcon,
  CameraIcon,
  Loader2Icon,
} from "lucide-react"

import { useUpdateAvatarMutation } from "@/api/user.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser } from "@/hooks/use-current-user"
import { fetchCurrentUser } from "@/store/auth.slice"
import { useAppDispatch } from "@/store/hooks"
import { UserContainer } from "@/components/user/user-container"

function getInitials(name?: string) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getRoleName(role?: string | null) {
  if (role === "Admin") return "Quản trị viên"
  if (role === "HR") return "Nhà tuyển dụng"
  if (role === "Candidate") return "Ứng viên"
  return "Người dùng"
}

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useCurrentUser()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const avatarInputRef = useRef<HTMLInputElement>(null)

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

  const menuItems = [
    {
      title: "Quản lí CV",
      url: "/tai-khoan-cua-toi/quan-ly-cv",
      icon: FileTextIcon,
    },
    {
      title: "Quản lí công việc",
      url: "/tai-khoan-cua-toi/quan-ly-cong-viec",
      icon: BriefcaseIcon,
    },
    {
      title: "Thông tin cá nhân",
      url: "/tai-khoan-cua-toi",
      icon: UserIcon,
    },
  ]

  return (
    <UserContainer className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar Card */}
        <div className="h-fit rounded-xl border bg-card text-card-foreground shadow-sm">
          {/* Avatar Section */}
          <div className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-24 border shadow-sm">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="text-xl font-semibold bg-muted text-muted-foreground">
                {getInitials(user?.name) || "U"}
              </AvatarFallback>
            </Avatar>

            <h3 className="mt-4 text-base font-semibold text-foreground truncate max-w-full">
              {user?.name || "Người dùng"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {getRoleName(user?.role)}
            </p>

            <div className="mt-5 w-full">
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
                size="sm"
                className="w-full flex items-center justify-center gap-2 rounded-lg"
                disabled={updateAvatarMutation.isPending}
                onClick={() => avatarInputRef.current?.click()}
              >
                {updateAvatarMutation.isPending ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <CameraIcon className="size-4" />
                    Cập nhật ảnh
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.url
              const Icon = item.icon
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-r-md border-l-2 ${
                    isActive
                      ? "border-foreground bg-muted text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Main Content */}
        <div className="min-w-0">{children}</div>
      </div>
    </UserContainer>
  )
}
