// auth.service.ts

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "./api";

import { ResponseEntity } from "@/types/base";
import { RegisterRequest } from "@/types/user";

type ApiError = AxiosError<ResponseEntity<string>>;

export const userApi = {
  async register(payload: RegisterRequest): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/users/register", payload);
    return res.data;
  },

};

export function useRegisterMutation() {
  return useMutation<ResponseEntity<string>, ApiError, RegisterRequest>({
    mutationFn: userApi.register,
  });
}