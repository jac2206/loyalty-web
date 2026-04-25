"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const { values, fieldErrors, isLoading, error, updateField, handleSubmit } =
    useLogin();

  return (
    <Card className="w-full max-w-md">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesion</h1>
          <p className="text-sm text-gray-600">
            Accede a tu cuenta para consultar tus puntos y movimientos.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={fieldErrors.email}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Contrasena"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={fieldErrors.password}
            placeholder="Tu contrasena"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" isLoading={isLoading} loadingText="Ingresando...">
          Ingresar
        </Button>

        <p className="text-center text-sm text-gray-600">
          No tienes cuenta?{" "}
          <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/register">
            Registrate
          </Link>
        </p>
      </form>
    </Card>
  );
}
