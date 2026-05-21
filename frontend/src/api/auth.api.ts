// auth.service.ts

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "./api";

import { ResponseEntity } from "@/types/base";
import { GoogleLoginRequest, LoginRequest } from "@/types/auth";

type ApiError = AxiosError<ResponseEntity<string>>;

export const authApi = {
  async login(payload: LoginRequest): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/auth/login", payload);
    return res.data;
  },

  async googleLogin(
    payload: GoogleLoginRequest,
  ): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/auth/google", payload);
    return res.data;
  },

  async logout(): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/auth/logout");
    return res.data;
  },
};

export function useLogin() {
  return useMutation<ResponseEntity<string>, ApiError, LoginRequest>({
    mutationFn: authApi.login,
  });
}

export function useGoogleLoginMutation() {
  return useMutation<ResponseEntity<string>, ApiError, GoogleLoginRequest>({
    mutationFn: authApi.googleLogin,
  });
}

export function useLogout() {
  return useMutation<ResponseEntity<string>, ApiError>({
    mutationFn: authApi.logout,
  });
}
