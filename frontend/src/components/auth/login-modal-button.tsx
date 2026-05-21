"use client"

import { UserRound } from "lucide-react"

import { NavUser } from "@/components/auth/nav-user"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useAppDispatch } from "@/store/hooks"
import { openLoginModal } from "@/store/modal.slice"

export function LoginModalButton() {
  const dispatch = useAppDispatch()
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
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

  if (user) {
    return <NavUser user={user} variant="header" />
  }

  return (
    <Button type="button" onClick={() => dispatch(openLoginModal())}>
      <UserRound />
      Đăng nhập
    </Button>
  )
}
