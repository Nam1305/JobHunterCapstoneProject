"use client"

import { UserRound } from "lucide-react"

import { NavUser } from "@/components/auth/nav-user"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useAppDispatch } from "@/store/hooks"
import { openLoginModal } from "@/store/modal.slice"

export function LoginModalButton() {
  const dispatch = useAppDispatch()
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return <NavUser variant="header" />
  }

  if (user) {
    return <NavUser variant="header" />
  }

  return (
    <Button type="button" onClick={() => dispatch(openLoginModal())}>
      <UserRound />
      Đăng nhập
    </Button>
  )
}
