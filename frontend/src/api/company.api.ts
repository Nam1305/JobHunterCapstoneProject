import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { ResponseEntity } from "@/types/base";
import { ApiError } from "next/dist/server/api-utils";
import { BrandingRequestDto, BrandingResponseDto } from "@/types/company";

export const companyApi = {
    async addTeamImages(images: File[]): Promise<string[]>{
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));

        const res = await api.post<string[]>(`hr/company/branding/team-images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },
    async deleteTeamImage(imageUrl: string): Promise<string> {
        const res = await api.delete<string>(`hr/company/branding/team-images`, {
            params: {
                imageUrl
            }
        });
        return res.data;
    },
    async getBranding(): Promise<ResponseEntity<BrandingResponseDto>> {
        const res = await api.get<ResponseEntity<BrandingResponseDto>>(`hr/company/branding`);
        return res.data;
    },
    async updateBranding(brandingData: BrandingRequestDto): Promise<ResponseEntity<null>> {
        const res = await api.put<ResponseEntity<null>>(`hr/company/branding`, brandingData);
        return res.data;
    }
}

export function useAddTeamImages() {
    return useMutation<string[], ApiError, {images: File[]}>({
        mutationFn: ({ images }) => companyApi.addTeamImages(images),
    });
}

export function useDeleteTeamImage() {
    return useMutation<string, ApiError, {imageUrl: string}>({
        mutationFn: ({ imageUrl }) => companyApi.deleteTeamImage(imageUrl),
    });
}

export function useGetBranding() {
    return useQuery<ResponseEntity<BrandingResponseDto>, ApiError>({
        queryKey: ['companyBranding'],
        queryFn: () => companyApi.getBranding(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpdateBranding() {
    return useMutation<ResponseEntity<null>, ApiError, {brandingData: BrandingRequestDto}>({
        mutationFn: ({ brandingData }) => companyApi.updateBranding(brandingData),
    });
}