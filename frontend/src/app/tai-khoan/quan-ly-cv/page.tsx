import { FileTextIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

export default function ManageCVPage() {
  return (
    <div className="p-6">
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full border bg-muted/40">
            <FileTextIcon className="size-6 text-muted-foreground" />
          </div>

          <CardTitle className="text-xl">Quản lý CV</CardTitle>

          <CardDescription className="mt-2 max-w-sm">
            Tính năng đang được phát triển. Bạn sẽ có thể quản lý và
            tạo CV chuyên nghiệp tại đây.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
