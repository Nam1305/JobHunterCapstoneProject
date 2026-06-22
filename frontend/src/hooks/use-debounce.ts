"use client"

import { useEffect, useState } from "react"

/**
 * A custom hook to debounce a value.
 * Useful for debouncing search input or other fast-changing values.
 *
 * @param value The value to be debounced.
 * @param delay The delay in milliseconds (default: 1000ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
