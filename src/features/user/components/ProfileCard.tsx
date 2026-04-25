"use client";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useUser } from "../hooks/useUser";
import type { UserProfile } from "../types/user.types";

function getDisplayName(user: UserProfile): string {
  if (user.name) {
    return user.name;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || "Usuario";
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-t border-gray-100 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900">
        {value || "No disponible"}
      </p>
    </div>
  );
}

export function ProfileCard() {
  const { user, isLoading, error, reloadUser } = useUser();

  return (
    <Card className="w-full max-w-xl">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Perfil
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Datos del usuario</h1>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-64 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-52 animate-pulse rounded bg-gray-100" />
          <p className="text-sm text-gray-600">Cargando perfil...</p>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <Button
            type="button"
            onClick={() => void reloadUser()}
            className="w-auto px-5"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {!isLoading && !error && user ? (
        <div className="mt-6">
          <div className="rounded-lg bg-blue-50 px-4 py-4">
            <p className="text-xl font-bold text-gray-950">
              {getDisplayName(user)}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Informacion obtenida desde /users/me.
            </p>
          </div>

          <div className="mt-4">
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Tipo de documento" value={user.documentType} />
            <ProfileRow label="Numero de documento" value={user.documentNumber} />
          </div>
        </div>
      ) : null}
    </Card>
  );
}
