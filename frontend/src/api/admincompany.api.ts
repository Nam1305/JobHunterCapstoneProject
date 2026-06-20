import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "./api";

import { ResponseEntity, PageResult } from "@/types/base";
import { CompanyRegistrationRequest, CompanyRegistrationRequestDetail, CompanyTaxInfo } from "@/types/company";

type ApiError = AxiosError<ResponseEntity<string>>;

export interface GetCompanyRegistrationRequestsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const adminCompanyRegistrationApi = {
  async getAllCompaniesRegistrations(
    params: GetCompanyRegistrationRequestsParams,
  ): Promise<ResponseEntity<PageResult<CompanyRegistrationRequest>>> {
    const res = await api.get<ResponseEntity<PageResult<CompanyRegistrationRequest>>>(
      "/admin/company-registrations",
      { params },
    );
    return res.data;
  },

  async getRequestDetails(
    id: string,
  ): Promise<ResponseEntity<CompanyRegistrationRequestDetail>> {
    const res = await api.get<ResponseEntity<CompanyRegistrationRequestDetail>>(
      `/admin/company-registrations/${id}`,
    );
    return res.data;
  },

  async approveRegistration(
    id: string,
  ): Promise<ResponseEntity<string>> {
    const res = await api.patch<ResponseEntity<string>>(
      `/admin/company-registrations/${id}/approve`,
    );
    return res.data;
  },

  async checkTaxCode(
    taxCode: string,
  ): Promise<ResponseEntity<CompanyTaxInfo>> {
    const res = await api.get<ResponseEntity<CompanyTaxInfo>>(
      "/admin/check-tax-code",
      { params: { taxCode } },
    );
    return res.data;
  },
};

// ─── Query Hooks ─────────────────────────────────────────────

export function useCompanyRegistrationsQuery(
  params: GetCompanyRegistrationRequestsParams,
) {
  return useQuery<ResponseEntity<PageResult<CompanyRegistrationRequest>>>({
    queryKey: ["admin", "company-registrations", params],
    queryFn: () => adminCompanyRegistrationApi.getAllCompaniesRegistrations(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompanyRegistrationRequestDetails(id: string | null) {
  return useQuery<ResponseEntity<CompanyRegistrationRequestDetail>>({
    queryKey: ["admin", "company-registration-details", id],
    queryFn: () => adminCompanyRegistrationApi.getRequestDetails(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutation Hooks ──────────────────────────────────────────

export function useApproveRegistrationMutation() {
  return useMutation<ResponseEntity<string>, ApiError, string>({
    mutationFn: (id) => adminCompanyRegistrationApi.approveRegistration(id),
  });
}

export function useCheckTaxCodeMutation() {
  return useMutation<ResponseEntity<CompanyTaxInfo>, ApiError, string>({
    mutationFn: (taxCode) => adminCompanyRegistrationApi.checkTaxCode(taxCode),
  });
}
