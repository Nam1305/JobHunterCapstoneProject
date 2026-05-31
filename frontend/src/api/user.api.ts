// auth.service.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "./api";

import { PageResult, ResponseEntity } from "@/types/base";
import { CreateUserRequest, RegisterRequest, UpdateUserRequest, Userinfo, CurrentUser } from "@/types/user";

type ApiError = AxiosError<ResponseEntity<string>>;

export interface GetUsersParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const userApi = {
  async getUsers(
    params: GetUsersParams,
  ): Promise<ResponseEntity<PageResult<Userinfo>>> {
    const res = await api.get<ResponseEntity<PageResult<Userinfo>>>("/users", {
      params,
    });
    return res.data;
  },

  async createUser(payload: CreateUserRequest): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/users", payload);
    return res.data;
  },

  async register(payload: RegisterRequest): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/users/register", payload);
    return res.data;
  },

  async deleteUser(userId: string): Promise<ResponseEntity<string>> {
    const res = await api.delete<ResponseEntity<string>>(`/users/${userId}`);
    return res.data;
  },

  async UpdateUser(payload: UpdateUserRequest): Promise<ResponseEntity<string>> {
    const res = await api.put<ResponseEntity<string>>(`/users/me`, payload);
    return res.data;
  },

  async getCurrentUser(): Promise<ResponseEntity<CurrentUser>> {
    const res = await api.get<ResponseEntity<CurrentUser>>("/users/me");
    return res.data;
  },

  async updateAvatar(payload: FormData): Promise<ResponseEntity<string>> {
    const res = await api.post<ResponseEntity<string>>("/users/avatar", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
};

export function useUsersQuery(params: GetUsersParams) {
  return useQuery<ResponseEntity<PageResult<Userinfo>>>({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRegisterMutation() {
  return useMutation<ResponseEntity<string>, ApiError, RegisterRequest>({
    mutationFn: userApi.register,
  });
}

export function useDeleteUserMutation() {
  return useMutation<ResponseEntity<string>, ApiError, string>({
    mutationFn: userApi.deleteUser,
  });
}

export function useCreateUserMutation() {
  return useMutation<ResponseEntity<string>, ApiError, CreateUserRequest>({
    mutationFn: userApi.createUser,
  });
}

export function useUpdateUserMutation() {
  return useMutation<ResponseEntity<string>, ApiError, UpdateUserRequest>({
    mutationFn: userApi.UpdateUser,
  });
}

export function useCurrentUserQuery() {
  return useQuery<ResponseEntity<CurrentUser>>({
    queryKey: ["currentUser"],
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateAvatarMutation() {
  return useMutation<ResponseEntity<string>, ApiError, FormData>({
    mutationFn: userApi.updateAvatar,
  });
}