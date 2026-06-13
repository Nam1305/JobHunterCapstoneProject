import { JobPostingFormPage } from "@/app/hr/dang-tin-tuyen-dung/_components/job-posting-form-page"

interface EditJobPostingPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJobPostingPage({
  params,
}: EditJobPostingPageProps) {
  const { id } = await params

  return <JobPostingFormPage mode="edit" jobId={id} />
}
