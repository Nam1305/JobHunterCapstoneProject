"use client"

import { useEffect, useState, type ComponentProps } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import {
  candidateQueryKeys,
  useLikedJobsStatusQuery,
  useToggleJobLikeMutation,
} from "@/api/candidate.api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/modal.slice"

type SaveJobButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  jobId: string
}

export function SaveJobButton({
  jobId,
  className,
  disabled,
  children = "Lưu công việc",
  type = "button",
  ...props
}: SaveJobButtonProps) {
  const [currentLiked, setCurrentLiked] = useState<boolean | null>(null)
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading)
  const isSignedIn = Boolean(user)
  const isCandidate = user?.role === "Candidate"

  const likedStatusQuery = useLikedJobsStatusQuery([jobId], isCandidate)
  const toggleJobLikeMutation = useToggleJobLikeMutation()

  const queriedLiked = Boolean(
    likedStatusQuery.data?.data?.likedJobIds.includes(jobId)
  )
  const isLiked = currentLiked ?? queriedLiked

  const isBusy = likedStatusQuery.isFetching || toggleJobLikeMutation.isPending

  useEffect(() => {
    if (likedStatusQuery.data) {
      setCurrentLiked(queriedLiked)
    }
  }, [likedStatusQuery.data, queriedLiked])

  return (
    <Button
      type={type}
      className={cn(
        "hover:bg-input/30 hover:text-current",
        className
      )}
      variant="outline"
      disabled={disabled || isAuthLoading || isBusy}
      onClick={() => {
        if (!isSignedIn || !isCandidate) {
          dispatch(openLoginModal())
          toast.info("Đăng nhập là ứng viên để lưu công việc")
          return
        }

        toggleJobLikeMutation.mutate(jobId, {
          onSuccess: (response) => {
            const nextLiked = Boolean(response.data?.isLiked)
            setCurrentLiked(nextLiked)
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
      {...props}
    >
      <Heart className={cn(isLiked && "fill-current")} />
      {children}
    </Button>
  )
}
