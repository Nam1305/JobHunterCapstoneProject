import { ResponseEntity } from "@/types/base";
import { BranchOption } from "@/types/job";
import api from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CompanyBranchReponseDto, CompanyBranchRequestDto } from "@/types/company";

type ApiError = AxiosError<ResponseEntity<null>>;

export const branchApi = {
    async getBranchOption(): Promise<BranchOption[]>{
        const res = await api.get<ResponseEntity<BranchOption[]>>("hr/company/branch/getbyUId");
        return res.data.data ?? [];
    },
    async getBranches(): Promise<ResponseEntity<CompanyBranchRequestDto[]>>{
        const res = await api.get<ResponseEntity<CompanyBranchRequestDto[]>>("hr/company/branches");
        return res.data;
    },
    async createBranch(branchData: CompanyBranchReponseDto): Promise<ResponseEntity<null>>{
        const res = await api.post<ResponseEntity<null>>("hr/company/branch", branchData);
        return res.data;
    },
    async updateBranch(id: string, branchData: CompanyBranchReponseDto): Promise<ResponseEntity<null>>{
        const res = await api.put<ResponseEntity<null>>(`hr/company/branch/${id}`, branchData);
        return res.data;
    },
    async deleteBranch(id: string): Promise<ResponseEntity<null>>{
        const res = await api.delete<ResponseEntity<null>>(`hr/company/branch/${id}`);
        return res.data;
    },
}


export function useGetBranchOption(){
    return useQuery<BranchOption[], ApiError>({
        queryKey: ["branches"],
        queryFn:  branchApi.getBranchOption,
        staleTime: 5 * 60 * 1000,
    });
}

export function useGetBranches(){
    return useQuery<ResponseEntity<CompanyBranchRequestDto[]>, ApiError>({
        queryKey: ["companyBranches"],
        queryFn: branchApi.getBranches,
        staleTime: 5 * 60 * 1000
    });
}

export function useCreateBranch(){
    return useMutation<ResponseEntity<null>, ApiError, { branchData: CompanyBranchReponseDto }>({
        mutationFn: ({ branchData }) => branchApi.createBranch(branchData),
    });
}

export function useUpdateBranch(){
    return useMutation<ResponseEntity<null>, ApiError, { id: string; branchData: CompanyBranchReponseDto }>({
        mutationFn: ({ id, branchData }) => branchApi.updateBranch(id, branchData),
    });
}

export function useDeleteBranch(){
    return useMutation<ResponseEntity<null>, ApiError, { id: string }>({
        mutationFn: ({ id }) => branchApi.deleteBranch(id),
    });
}
