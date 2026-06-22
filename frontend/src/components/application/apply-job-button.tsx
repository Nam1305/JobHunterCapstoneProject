"use client"

import type { ComponentProps } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  openLoginModal,
  openApplicationModal,
  type ApplicationModalJob,
} from "@/store/modal.slice"

type ApplyJobButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  job: ApplicationModalJob
  onClick?: ComponentProps<typeof Button>["onClick"]
}

export function ApplyJobButton({
  children = "Ứng tuyển",
  job,
  onClick,
  type = "button",
  ...props
}: ApplyJobButtonProps) {
  const dispatch = useAppDispatch()
  const userRole = useAppSelector((state) => state.auth.user?.role ?? null)

  return (
    <Button
      type={type}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented) {
          return
        }

        if (userRole === "Candidate") {
          dispatch(openApplicationModal(job))
          return
        }

        dispatch(openLoginModal())
        toast.info("Đăng nhập là ứng viên để thực hiện chức năng này")
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
