import { UploadIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ProfilePictureUpload() {
  return (
    <Card className="items-center gap-5 px-6 py-8 text-center">
      <Avatar className="size-32 shadow-sm">
        <AvatarFallback className="text-3xl font-semibold">QM</AvatarFallback>
      </Avatar>

      <div className="grid w-full gap-3">
        <Button variant="outline" size="lg" className="w-full">
          <UploadIcon />
          Tải ảnh lên
        </Button>
        <p className="text-sm leading-6 text-muted-foreground">
          JPG, PNG hoặc GIF
          <br />
          Kích thước tối đa: 2MB
        </p>
      </div>
    </Card>
  )
}
