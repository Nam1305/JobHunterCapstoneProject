"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { JobPostingEditForm } from "./job-posting-edit-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface JobPostingFormPageProps {
  mode: "create" | "edit"
  jobId?: string
}

const jobPostingListHref = "/hr/dang-tin-tuyen-dung"

export function JobPostingFormPage({ jobId, mode }: JobPostingFormPageProps) {
  const router = useRouter()
  const pageTitle = mode === "create" ? "Tạo tin mới" : "Chỉnh sửa tin"

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={jobPostingListHref}>Quản lí tin tuyển dụng</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <JobPostingEditForm
        jobId={jobId}
        mode={mode}
        onCancel={() => router.push(jobPostingListHref)}
      />
    </div>
  )
}
