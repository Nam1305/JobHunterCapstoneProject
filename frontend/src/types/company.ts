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