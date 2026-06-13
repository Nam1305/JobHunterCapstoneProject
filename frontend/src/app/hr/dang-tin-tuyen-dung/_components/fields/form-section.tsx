import { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FormSectionProps {
  children: ReactNode
  title: string
}

export function FormSection({ children, title }: FormSectionProps) {
  return (
    <Card className="gap-5 py-6">
      <CardHeader className="px-5 pb-0 md:px-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 md:px-6">{children}</CardContent>
    </Card>
  )
}
