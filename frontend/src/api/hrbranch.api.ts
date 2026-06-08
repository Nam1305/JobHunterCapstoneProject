import { ResponseEntity } from "@/types/base";
import { BranchOption } from "@/types/job";
import api from "./api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";




export const branchApi = {
    async getBranchOption(): Promise<BranchOption[]>{
        const res = await api.get<ResponseEntity<BranchOption[]>>("hr/company/brach/getbyUId");
        return res.data.data ?? [];
    }
}


export function useGetBranchOption(){
    return useQuery<BranchOption[], AxiosError>({
        queryKey: ["branches"],
        queryFn:  branchApi.getBranchOption,
        staleTime: 5 * 60 * 1000
    });
}
