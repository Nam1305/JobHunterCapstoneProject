import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HRPlaceholderPageProps = {
  title: string
  description: string
}

export function HRPlaceholderPage({
  title,
  description,
}: HRPlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="space-y-2">
            <Badge variant="outline">Trang mẫu</Badge>
            <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nội dung đang được chuẩn bị</CardTitle>
              <CardDescription>
                Đây là dữ liệu giả để kiểm tra điều hướng và bố cục.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Khi chức năng thật được triển khai, khu vực này sẽ hiển thị
                danh sách, biểu mẫu, bộ lọc và các thao tác phù hợp với nghiệp
                vụ tuyển dụng.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
