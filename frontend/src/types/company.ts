import type { CompanyBranchResponse } from "./job"

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
import { File } from "buffer";

export interface TeamImages {
  urls: File[]
}

export interface BrandingResponseDto extends BrandingRequestDto {

    teamPhotoUrls?: string[];
}

export interface BrandingRequestDto {
  overview?: string;
  benefits?: string;
}

export interface CompanyGeneralRequestDto {
  name?: string;
  teamSize?: string;
  websiteUrl?: string;
  country?: string;
  companyType?: string;
}

export interface CompanyGeneralResponseDto extends CompanyGeneralRequestDto {
  logoUrl?: string;
  coverUrl?: string;
}


export interface CompanyBranchReponseDto {
  name: string;
  address:string;
  city: string;
}

export interface CompanyBranchRequestDto extends CompanyBranchReponseDto {
  id: string;
}