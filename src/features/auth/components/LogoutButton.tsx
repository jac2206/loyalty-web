"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { clearAuthSession } from "@/shared/services/authStorage";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  return (
    <Button type="button" onClick={handleLogout} className="w-auto px-5">
      Cerrar sesion
    </Button>
  );
}
