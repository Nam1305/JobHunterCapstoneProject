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

export interface CompanyBranding {
  overview: string;
  benefits: string;
  teamPhotoUrls: string[];
}