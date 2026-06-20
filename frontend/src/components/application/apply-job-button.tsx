"use client"

import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import {
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

  return (
    <Button
      type={type}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented) {
          dispatch(openApplicationModal(job))
        }
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
