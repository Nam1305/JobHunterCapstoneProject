"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useGetBranchOption } from "@/api/hrbranch.api"
import {
  useCategoriesQuery,
  useCreateJobPosting,
  useExperienceLevelsQuery,
} from "@/api/hrjob.api"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { JobPostingCategory, JobPostingOption } from "@/types/job"
import {
  defaultFormValues,
  formSchema,
  JobPostingForm,
  type FormValues,
} from "../_components/job-posting-form"

const jobPostingListHref = "/hr/dang-tin-tuyen-dung"
const emptyCategories: JobPostingCategory[] = []
const emptyOptions: JobPostingOption[] = []

export default function CreateJobPostingPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const categoriesQuery = useCategoriesQuery()
  const branchOptionsQuery = useGetBranchOption()
  const experienceLevelsQuery = useExperienceLevelsQuery()
  const createMutation = useCreateJobPosting()

  const isOptionsLoading =
    categoriesQuery.isLoading ||
    branchOptionsQuery.isLoading ||
    experienceLevelsQuery.isPending
  const isSubmitting = createMutation.isPending

  function onSubmit(values: FormValues) {
    form.clearErrors("root")

    createMutation.mutate(toJobPostingPayload(values), {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
        toast.success(response.message || "Tạo tin tuyển dụng thành công")
      },
      onError: (error) => {
        const message =
          error.response?.data.message || "Không thể tạo tin tuyển dụng"

        form.setError("root", { message })
        toast.error(message)
      },
    })
  }

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
              <BreadcrumbPage>Tạo tin mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <JobPostingForm
        mode="create"
        form={form}
        categories={categoriesQuery.data ?? emptyCategories}
        branchOptions={branchOptionsQuery.data ?? emptyOptions}
        experienceLevelOptions={experienceLevelsQuery.data?.data ?? emptyOptions}
        isFormDisabled={isOptionsLoading || isSubmitting}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={() => router.push(jobPostingListHref)}
      />
    </div>
  )
}

function toJobPostingPayload(values: FormValues) {
  return {
    name: values.title,
    salaryRange: values.salary,
    jobWorkType: values.jobWorkType,
    experiedDate: values.expiredDate,
    category: values.category,
    subCategory: values.subCategory,
    branch: values.branch,
    experienceLevels: values.experienceLevels,
    experienceRequirement: values.experienceYears,
    tags: values.tags,
    responsibilities: values.responsibilities,
    requirements: values.requirements,
    benefits: values.benefits,
  }
}
