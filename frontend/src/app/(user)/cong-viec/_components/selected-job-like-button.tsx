"use client"

import { useLikedJobsStatusQuery } from "@/api/candidate.api"
import { useAppSelector } from "@/store/hooks"
import { JobLikeButton } from "./job-like-button"

export function SelectedJobLikeButton({
  jobId,
  jobIds,
}: {
  jobId: string
  jobIds: string[]
}) {
  const user = useAppSelector((state) => state.auth.user)
  const isCandidate = user?.role === "Candidate"
  const likedJobsStatusQuery = useLikedJobsStatusQuery(jobIds, isCandidate)
  const likedJobIds = likedJobsStatusQuery.data?.data?.likedJobIds ?? []

  return (
    <JobLikeButton
      jobId={jobId}
      isLiked={likedJobIds.includes(jobId)}
      variant="outline"
      size="icon"
    />
  )
}
