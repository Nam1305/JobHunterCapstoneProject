"use client"

import { type ComponentProps } from "react"
import { Heart } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  candidateQueryKeys,
  useToggleJobLikeMutation,
} from "@/api/candidate.api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/modal.slice"

type JobLikeButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  jobId: string
  isLiked: boolean
  stopPropagation?: boolean
}

export function JobLikeButton({
  jobId,
  isLiked,
  stopPropagation = false,
  className,
  disabled,
  children,
  type = "button",
  variant = "outline",
  "aria-label": ariaLabel = "Lưu công việc",
  onKeyDown,
  ...props
}: JobLikeButtonProps) {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isCandidate = user?.role === "Candidate"
  const toggleJobLikeMutation = useToggleJobLikeMutation()

  return (
    <Button
      type={type}
      variant={variant}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      className={cn(
        "border-transparent bg-transparent hover:bg-transparent hover:text-current",
        isLiked && "text-black dark:text-white",
        className
      )}
      disabled={disabled || toggleJobLikeMutation.isPending}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }

        if (!isCandidate) {
          dispatch(openLoginModal())
          toast.info("Đăng nhập là ứng viên để lưu công việc")
          return
        }

        toggleJobLikeMutation.mutate(jobId, {
          onSuccess: (response) => {
            const nextLiked = Boolean(response.data?.isLiked)
            queryClient.invalidateQueries({
              queryKey: candidateQueryKeys.likedJobsStatusRoot,
            })
            toast.success(
              nextLiked ? "Đã lưu công việc" : "Đã bỏ lưu công việc"
            )
          },
          onError: () => {
            toast.error("Không thể cập nhật trạng thái lưu. Vui lòng thử lại.")
          },
        })
      }}
      onKeyDown={(event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }

        onKeyDown?.(event)
      }}
      {...props}
    >
      <Heart className={cn(isLiked && "fill-current")} />
      {children}
    </Button>
  )
}
