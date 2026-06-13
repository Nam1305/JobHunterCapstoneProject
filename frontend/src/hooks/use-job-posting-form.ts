import { useEffect, useMemo, useRef } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  useCategoriesQuery,
  useCreateJobPosting,
  useExperienceLevelsQuery,
  useJobPostingDetailQuery,
  useUpdateJobPosting,
} from "@/api/hrjob.api"
import { useGetBranchOption } from "@/api/hrbranch.api"
import {
  DEFAULT_FORM_VALUES,
  EMPTY_BRANCH_OPTIONS,
  EMPTY_CATEGORY_OPTIONS,
  EMPTY_EXPERIENCE_LEVEL_OPTIONS,
  EMPTY_SUB_CATEGORY_OPTIONS,
  formSchema,
  FormValues,
  toFormValues,
  toUpdatePayload,
} from "@/components/hr/job-posting-form-schema"
import type {
  JobPostingCategory as Category,
  JobPostingOption,
} from "@/types/job"

interface UseJobPostingFormProps {
  jobId?: string
  mode: "create" | "edit"
}

export interface UseJobPostingFormReturn {
  form: UseFormReturn<FormValues>
  isEditMode: boolean
  isFormDisabled: boolean
  isCategoriesLoading: boolean
  isBranchOptionsLoading: boolean
  isExperienceLevelsPending: boolean
  areOptionsReady: boolean
  jobPostingDetailError: unknown
  isJobPostingDetailLoading: boolean
  isSubmitting: boolean
  categories: Category[]
  branchOptions: JobPostingOption[]
  experienceLevelOptions: JobPostingOption[]
  subCategoryOptions: JobPostingOption[]
  selectedCategoryId: string
  selectedCategory: Category | undefined
  onSubmit: (values: FormValues) => void
  pageTitle: string
  pageDescription: string
  submitLabel: string
}

export function useJobPostingForm({
  jobId,
  mode,
}: UseJobPostingFormProps): UseJobPostingFormReturn {
  const queryClient = useQueryClient()
  const isEditMode = mode === "edit"
  const optionRefetchOnMount = isEditMode ? "always" : undefined

  const {
    data: categoriesData,
    isFetching: isCategoriesFetching,
    isLoading: isCategoriesLoading,
  } = useCategoriesQuery({ refetchOnMount: optionRefetchOnMount })

  const {
    data: branchOptionsData,
    isFetching: isBranchOptionsFetching,
    isLoading: isBranchOptionsLoading,
  } = useGetBranchOption({ refetchOnMount: optionRefetchOnMount })

  const {
    data: experienceLevelsResponse,
    isFetching: isExperienceLevelsFetching,
    isPending: isExperienceLevelsPending,
  } = useExperienceLevelsQuery({ refetchOnMount: optionRefetchOnMount })

  const areOptionsReady =
    !isCategoriesLoading &&
    !isCategoriesFetching &&
    !isBranchOptionsLoading &&
    !isBranchOptionsFetching &&
    !isExperienceLevelsPending &&
    !isExperienceLevelsFetching

  const canLoadJobPostingDetail =
    isEditMode &&
    Boolean(jobId) &&
    areOptionsReady

  const {
    data: jobPostingDetail,
    error: jobPostingDetailError,
    isLoading: isJobPostingDetailLoading,
  } = useJobPostingDetailQuery(jobId ?? "", canLoadJobPostingDetail)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const initializedJobIdRef = useRef<string | null>(null)

  const createJobPostingMutation = useCreateJobPosting()
  const updateJobPostingMutation = useUpdateJobPosting()

  useEffect(() => {
    if (!isEditMode) {
      initializedJobIdRef.current = null
      return
    }

    if (
      !jobId ||
      !jobPostingDetail?.data ||
      !areOptionsReady
    ) {
      return
    }

    if (initializedJobIdRef.current === jobId) {
      return
    }

    form.reset(
      toFormValues(
        jobPostingDetail.data,
        categoriesData ?? [],
        branchOptionsData ?? [],
        experienceLevelsResponse?.data ?? []
      )
    )
    initializedJobIdRef.current = jobId
  }, [
    branchOptionsData,
    categoriesData,
    experienceLevelsResponse,
    form,
    areOptionsReady,
    isEditMode,
    jobId,
    jobPostingDetail,
  ])

  const onSubmit = (values: FormValues) => {
    form.clearErrors("root")
    const payload = toUpdatePayload(values)

    if (isEditMode) {
      if (!jobId) {
        form.setError("root", { message: "Missing job posting id" })
        return
      }

      updateJobPostingMutation.mutate(
        {
          jobId,
          payload,
        },
        {
          onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
            queryClient.invalidateQueries({
              queryKey: ["jobPostingDetail", jobId],
            })

            initializedJobIdRef.current = null

            toast.success(
              response.message || "Cập nhật tin tuyển dụng thành công"
            )
          },
          onError: (error) => {
            const message =
              error.response?.data.message ||
              "Không thể cập nhật tin tuyển dụng"

            form.setError("root", { message })
            toast.error(message)
          },
        }
      )

      return
    }

    createJobPostingMutation.mutate(payload, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["jobPostings"] })
        form.reset(DEFAULT_FORM_VALUES)
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

  const isSubmitting =
    createJobPostingMutation.isPending || updateJobPostingMutation.isPending
  const isFormDisabled = isJobPostingDetailLoading || isSubmitting
  const categories = categoriesData ?? EMPTY_CATEGORY_OPTIONS
  const branchOptions = branchOptionsData ?? EMPTY_BRANCH_OPTIONS
  const experienceLevelOptions =
    experienceLevelsResponse?.data ?? EMPTY_EXPERIENCE_LEVEL_OPTIONS

  const selectedCategoryId = form.watch("category")
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )
  const subCategoryOptions =
    selectedCategory?.subcategories ?? EMPTY_SUB_CATEGORY_OPTIONS

  const pageTitle = isEditMode
    ? "Chỉnh sửa tin tuyển dụng"
    : "Tạo tin tuyển dụng"
  const pageDescription = isEditMode
    ? "Cập nhật thông tin bài đăng tuyển dụng."
    : "Nhập thông tin để tạo bài đăng tuyển dụng."
  const submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo tin"

  return {
    form,
    isEditMode,
    isFormDisabled,
    isCategoriesLoading,
    isBranchOptionsLoading,
    isExperienceLevelsPending,
    areOptionsReady,
    jobPostingDetailError,
    isJobPostingDetailLoading,
    isSubmitting,
    categories,
    branchOptions,
    experienceLevelOptions,
    subCategoryOptions,
    selectedCategoryId,
    selectedCategory,
    onSubmit,
    pageTitle,
    pageDescription,
    submitLabel,
  }
}
