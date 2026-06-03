import { CompanyBranchResponse } from "./job"

export interface CompanyCard {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  coverPhotoUrl: string | null
  companyType: string | null
  teamSize: string | null
  country: string | null
  openingVacancies: number
  numberOfFollowers: number
}

export interface Company {
  id: string
  name: string
  websiteUrl: string | null
  country: string | null
  companyType: string | null
  logoUrl: string | null
  coverPhotoUrl: string | null
  overview: string | null
  benefits: string | null
  teamPhotoUrls: string[]
  teamSize: string | null
  slug: string
  companyBranches: CompanyBranchResponse[]
}