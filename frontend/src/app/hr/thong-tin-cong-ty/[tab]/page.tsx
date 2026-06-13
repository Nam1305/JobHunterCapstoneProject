import {
  CompanyInformationForm,
  type CompanyInformationTab,
} from "@/app/hr/thong-tin-cong-ty/_components/company-information-form"
import { notFound } from "next/navigation"

const tabBySlug: Record<string, CompanyInformationTab> = {
  "thong-tin-chung": "general",
  branding: "branding",
  "chi-nhanh": "branches",
}

interface CompanyInfoTabPageProps {
  params: Promise<{
    tab: string
  }>
}

export default async function CompanyInfoTabPage({
  params,
}: CompanyInfoTabPageProps) {
  const { tab } = await params
  const currentTab = tabBySlug[tab]

  if (!currentTab) {
    notFound()
  }

  return <CompanyInformationForm currentTab={currentTab} />
}
