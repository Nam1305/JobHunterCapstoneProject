"use client"

import { type ComponentProps } from "react"
import { Heart } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  candidateQueryKeys,
  useLikedCompaniesStatusQuery,
  useToggleCompanyLikeMutation,
} from "@/api/candidate.api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/modal.slice"

type CompanyFollowButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick"
> & {
  companyId: string
  companyIds?: string[]
  stopPropagation?: boolean
}

export function CompanyFollowButton({
  companyId,
  companyIds = [companyId],
  stopPropagation = false,
  className,
  disabled,
  children,
  type = "button",
  variant = "outline",
  "aria-label": ariaLabel = "Theo dõi công ty",
  onKeyDown,
  ...props
}: CompanyFollowButtonProps) {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isCandidate = user?.role === "Candidate"
  const likedCompaniesStatusQuery = useLikedCompaniesStatusQuery(
    companyIds,
    isCandidate
  )
  const likedCompanyIds =
    likedCompaniesStatusQuery.data?.data?.likedCompanyIds ?? []
  const isLiked = likedCompanyIds.includes(companyId)
  const toggleCompanyLikeMutation = useToggleCompanyLikeMutation()

  return (
    <Button
      type={type}
      variant={variant}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      className={cn(isLiked && "text-black dark:text-white", className)}
      disabled={disabled || toggleCompanyLikeMutation.isPending}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }

        if (!isCandidate) {
          dispatch(openLoginModal())
          toast.info("Đăng nhập là ứng viên để theo dõi công ty")
          return
        }

        toggleCompanyLikeMutation.mutate(companyId, {
          onSuccess: (response) => {
            const nextLiked = Boolean(response.data?.isLiked)
            queryClient.invalidateQueries({
              queryKey: candidateQueryKeys.likedCompaniesStatusRoot,
            })
            toast.success(
              nextLiked ? "Đã theo dõi công ty" : "Đã bỏ theo dõi công ty"
            )
          },
          onError: () => {
            toast.error(
              "Không thể cập nhật trạng thái theo dõi. Vui lòng thử lại."
            )
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
      {children ?? (isLiked ? "Đang theo dõi" : "Theo dõi")}
    </Button>
  )
}
