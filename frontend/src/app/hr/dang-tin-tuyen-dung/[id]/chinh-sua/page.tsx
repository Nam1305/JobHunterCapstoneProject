"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useGetBranchOption } from "@/api/hrbranch.api"
import {
  useCategoriesQuery,
  useExperienceLevelsQuery,
  useJobPostingDetailQuery,
  useUpdateJobPosting,
} from "@/api/hrjob.api"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type {
  JobPostDetail,
  JobPostingCategory,
  JobPostingOption,
} from "@/types/job"
import {
  defaultFormValues,
  formSchema,
  JobPostingForm,
  type FormValues,
} from "../../_components/job-posting-form"

const jobPostingListHref = "/hr/dang-tin-tuyen-dung"
const emptyCategories: JobPostingCategory[] = []
const emptyOptions: JobPostingOption[] = []

export default function EditJobPostingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const jobId = params.id
  const hydratedJobIdRef = useRef<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const categoriesQuery = useCategoriesQuery()
  const branchOptionsQuery = useGetBranchOption()
  const experienceLevelsQuery = useExperienceLevelsQuery()
  const detailQuery = useJobPostingDetailQuery(jobId, Boolean(jobId))
  const updateMutation = useUpdateJobPosting()

  const isOptionsLoading =
    categoriesQuery.isLoading ||
    branchOptionsQuery.isLoading ||
    experienceLevelsQuery.isPending
  const isSubmitting = updateMutation.isPending
  const isFormDisabled =
    isOptionsLoading || detailQuery.isLoading || isSubmitting

  useEffect(() => {
    const jobPosting = detailQuery.data?.data

    if (!jobPosting) {
      return
    }

    if (hydratedJobIdRef.current === jobId) {
      return
    }

    form.reset(toFormValues(jobPosting))
    hydratedJobIdRef.current = jobId
  }, [detailQuery.data, form, jobId])

  function onSubmit(values: FormValues) {
    form.clearErrors("root")

    updateMutation.mutate(
      {
        jobId,
        payload: toJobPostingPayload(values),
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
          queryClient.invalidateQueries({
            queryKey: ["jobPostingDetail", jobId],
          })

          toast.success(
            response.message || "Cập nhật tin tuyển dụng thành công"
          )
        },
        onError: (error) => {
          const message =
            error.response?.data.message || "Không thể cập nhật tin tuyển dụng"

          form.setError("root", { message })
          toast.error(message)
        },
      }
    )
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
              <BreadcrumbPage>Chỉnh sửa tin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <JobPostingForm
        mode="edit"
        form={form}
        categories={categoriesQuery.data ?? emptyCategories}
        branchOptions={branchOptionsQuery.data ?? emptyOptions}
        experienceLevelOptions={experienceLevelsQuery.data?.data ?? emptyOptions}
        isFormDisabled={isFormDisabled}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={() => router.push(jobPostingListHref)}
      />
    </div>
  )
}

function toFormValues(jobPosting: JobPostDetail): FormValues {
  return {
    title: jobPosting.name ?? "",
    salary: jobPosting.salaryRange ?? "",
    jobWorkType: jobPosting.jobWorkType ?? "",
    expiredDate: toDateInputValue(
      jobPosting.experiedDate ?? jobPosting.expiredDate ?? ""
    ),
    category: jobPosting.category ?? "",
    subCategory: jobPosting.subCategory ?? "",
    branch: jobPosting.branch ?? "",
    experienceLevels: jobPosting.experienceLevels ?? [],
    experienceYears: jobPosting.experienceRequirement ?? "",
    tags: jobPosting.tags ?? [],
    responsibilities: jobPosting.responsibilities ?? "",
    requirements: jobPosting.requirements ?? "",
    benefits: jobPosting.benefits ?? "",
  }
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

function toDateInputValue(value: string) {
  return value ? value.slice(0, 10) : ""
}
