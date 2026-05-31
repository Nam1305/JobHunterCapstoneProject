"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CurrentUser } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogout } from "@/api/auth.api"
import {
  EllipsisVerticalIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
} from "lucide-react"
import { logout as clearAuthUser } from "@/store/auth.slice"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { useCurrentUser } from "@/hooks/use-current-user"

type NavUserData = Pick<CurrentUser, "name" | "email" | "avatar" | "role">

type NavUserProps = {
  variant?: "sidebar" | "header"
}

function getDisplayName(user: NavUserData) {
  return user.name || user.email || "User"
}

function getInitials(name: string | null | undefined) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return initials || "U"
}

function UserLabel({ user }: { user: NavUserData }) {
  const displayName = getDisplayName(user)

  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{displayName}</span>
      <span className="truncate text-xs text-muted-foreground">
        {user.email}
      </span>
    </div>
  )
}

function UserAvatar({
  user,
  grayscale = false,
}: {
  user: NavUserData
  grayscale?: boolean
}) {
  const displayName = getDisplayName(user)

  return (
    <Avatar
      className={
        grayscale ? "h-8 w-8 rounded-lg grayscale" : "h-8 w-8 rounded-lg"
      }
    >
      {user.avatar ? <AvatarImage src={user.avatar} alt={displayName} /> : null}
      <AvatarFallback className="rounded-lg">
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  )
}

function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-9 rounded-full" />
      <div className="hidden space-y-1.5 sm:block">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function getUserDashboardUrl(role: NavUserData["role"]) {
  if (role === "Admin") {
    return "/admin"
  }

  if (role === "HR") {
    return "/hr"
  }

  return null
}

function UserDropdownContent({
  user,
  side,
  className,
}: {
  user: NavUserData
  side: React.ComponentProps<typeof DropdownMenuContent>["side"]
  className?: string
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const logoutMutation = useLogout()
  const dashboardUrl = getUserDashboardUrl(user.role)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(clearAuthUser())
        toast.success("Đăng xuất thành công")
        router.push("/")
      },
      onError: (error) => {
        dispatch(clearAuthUser())
        toast.error(
          error.response?.data.message ||
            "Không thể đăng xuất trên máy chủ. Phiên cục bộ đã được xoá."
        )
        router.push("/")
      },
    })
  }

  return (
    <DropdownMenuContent
      className={className}
      side={side}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserAvatar user={user} />
          <UserLabel user={user} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {dashboardUrl ? (
        <>
          <DropdownMenuItem asChild>
            <Link href={dashboardUrl}>
              <LayoutDashboardIcon />
              Trang của tôi
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      ) : null}
      <DropdownMenuItem
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <LogOutIcon />
        )}
        {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

function SidebarNavUser({ user }: { user: NavUserData }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} grayscale />
              <UserLabel user={user} />
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserDropdownContent
            user={user}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function HeaderNavUser({ user }: { user: NavUserData }) {
  const displayName = getDisplayName(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="max-w-52 justify-start gap-2 px-2"
        >
          <UserAvatar user={user} />
          <span className="hidden truncate sm:inline">{displayName}</span>
          <EllipsisVerticalIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <UserDropdownContent
        user={user}
        className="min-w-56 rounded-lg"
        side="bottom"
      />
    </DropdownMenu>
  )
}

export function NavUser({ variant = "sidebar" }: NavUserProps) {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return <NavUserSkeleton />
  }

  if (!user) {
    return null
  }

  if (variant === "header") {
    return <HeaderNavUser user={user} />
  }

  return <SidebarNavUser user={user} />
}
