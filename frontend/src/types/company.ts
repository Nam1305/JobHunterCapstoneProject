import { File } from "buffer";

export interface TeamImages {
  urls: File[]
}

export interface BrandingResponseDto {
    overview?: string;
    benefits?: string;
    teamPhotoUrls?: string[];
}