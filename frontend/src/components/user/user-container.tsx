import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

export const userContainerClass = "mx-auto max-w-6xl px-4 sm:px-6"

type UserContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">

export function UserContainer<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: UserContainerProps<T>) {
  const Component = as ?? "div"

  return (
    <Component className={cn(userContainerClass, className)} {...props}>
      {children}
    </Component>
  )
}
