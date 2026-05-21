export type UserRole = "Admin" | "HR" | "Candidate";

export interface CurrentUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  avatar: string | null;
  role: UserRole | null;
}

