"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useUpdateUser } from "../hooks/useUpdateUser";

export function UpdateUserForm() {
  const { values, isLoading, isSaving, error, success, updateField, saveUser } =
    useUpdateUser();

  return (
    <Card className="operation-card profile-edit-card w-full max-w-xl">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void saveUser();
        }}
        noValidate
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Perfil
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Editar perfil</h1>
          <p className="text-sm text-gray-600">
            Puedes actualizar tu nombre y correo electrónico.
          </p>
        </div>

        {error ? (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-gray-600">Cargando perfil...</p>
        ) : (
          <div className="operation-fields">
            <Input
              label="Nombre completo"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Tu nombre completo"
              autoComplete="name"
              disabled={isSaving}
              required
            />
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              disabled={isSaving}
              required
            />
          </div>
        )}

        <div className="space-y-3">
          <Button type="submit" isLoading={isSaving} loadingText="Guardando..." disabled={isLoading}>
            Guardar cambios
          </Button>
          <Link
            href="/profile"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Volver al perfil
          </Link>
        </div>
      </form>
    </Card>
  );
}
