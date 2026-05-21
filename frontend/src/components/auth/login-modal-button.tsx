"use client";

import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { openLoginModal } from "@/store/modal.slice";

export function LoginModalButton() {
  const dispatch = useAppDispatch();

  return (
    <Button type="button" onClick={() => dispatch(openLoginModal())}>
      <UserRound />
      Đăng nhập
    </Button>
  );
}
