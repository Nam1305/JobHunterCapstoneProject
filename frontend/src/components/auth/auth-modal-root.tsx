"use client";

import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { useAppSelector } from "@/store/hooks";

export function AuthModalRoot() {
  const openModal = useAppSelector((state) => state.modal.openModal);

  if (openModal === "login") {
    return <LoginModal />;
  }

  if (openModal === "register") {
    return <RegisterModal />;
  }

  return null;
}
