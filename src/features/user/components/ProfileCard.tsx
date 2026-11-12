"use client";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import Link from "next/link";
import { useUser } from "../hooks/useUser";
import type { UserProfile } from "../types/user.types";

function getDisplayName(user: UserProfile): string {
  if (user.fullName) {
    return user.fullName;
  }

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

export function ProfileCard({ compact = false }: { compact?: boolean }) {
  const { user, isLoading, error, reloadUser } = useUser();

  return (
    <Card className={`w-full max-w-xl ${compact ? "profile-summary" : "profile-page-card"}`}>
      <div className="profile-heading">
        <span className="profile-icon"><Icon name="user" /></span>
        <div>
        <p className="dashboard-eyebrow">
          Perfil
        </p>
        {compact ? <h2 className="text-lg font-bold">Tu cuenta</h2> : <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>}
        </div>
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
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
        <div className="profile-content mt-6">
          <div className="profile-identity rounded-lg bg-blue-50 px-4 py-4">
            {!compact && <span className="profile-avatar"><Icon name="user" /></span>}
            <div>
            <p className="text-xl font-bold text-gray-950">
              {getDisplayName(user)}
            </p>
            {!compact && <p className="mt-1 text-sm text-gray-600">Estos son los datos de tu cuenta.</p>}
            </div>
          </div>

          <div className="mt-4">
            <ProfileRow label="Correo electrónico" value={user.email} />
            {compact ? <ProfileRow label="Documento" value={[user.documentType, user.documentNumber].filter(Boolean).join(" ")} /> : <><ProfileRow label="Tipo de documento" value={user.documentType} /><ProfileRow label="Número de documento" value={user.documentNumber} /></>}
          </div>
          <Link
            href="/profile/edit"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Actualizar nombre y correo
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
