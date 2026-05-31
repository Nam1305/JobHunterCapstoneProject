export type UserRole = "Admin" | "HR" | "Candidate";

export interface CurrentUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  avatar: string | null;
  role: UserRole | null;
}

export interface RegisterRequest {
  email: string
  password: string
  phone: string
  name: string
}

export interface CreateUserRequest extends UpdateUserRequest {
  role: UserRole | null
}

export interface Userinfo extends CurrentUser {
  isDeleted: boolean;
}

export interface UpdateUserRequest {
  name: string;
  phone: string;
  password: string;
}

export interface UpdateAvatarRequest {
  avatar: File;
}