"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { clearAuthSession } from "@/shared/services/authStorage";
import { Icon } from "@/shared/components/Icon";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  return (
    <Button type="button" variant="secondary" onClick={handleLogout} className={`w-auto px-5 ${className}`}>
      <Icon name="logout" /> Cerrar sesión
    </Button>
  );
}
