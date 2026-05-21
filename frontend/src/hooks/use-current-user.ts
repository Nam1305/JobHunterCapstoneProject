"use client"

import { useEffect } from "react"

import { fetchCurrentUser } from "@/store/auth.slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export function useCurrentUser() {
  const dispatch = useAppDispatch()
  const { user, bootstrapped, isLoading, error } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (!bootstrapped) {
      dispatch(fetchCurrentUser())
    }
  }, [bootstrapped, dispatch])

  return {
    user,
    bootstrapped,
    isLoading,
    error,
  }
}
