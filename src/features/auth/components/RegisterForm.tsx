"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useRegister } from "../hooks/useRegister";
import type { DocumentType } from "../types/auth.types";

const documentTypes: DocumentType[] = ["CC", "CE", "NIT", "PT"];

export function RegisterForm() {
  const { values, fieldErrors, isLoading, error, updateField, handleSubmit } =
    useRegister();

  return (
    <Card className="w-full max-w-2xl">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-600">
            Registra tus datos para empezar a acumular puntos.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="documentType"
            >
              Tipo de documento
            </label>
            <select
              id="documentType"
              name="documentType"
              value={values.documentType}
              onChange={(event) =>
                updateField("documentType", event.target.value as DocumentType)
              }
              disabled={isLoading}
              className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 ${fieldErrors.documentType ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
            >
              {documentTypes.map((documentType) => (
                <option key={documentType} value={documentType}>
                  {documentType}
                </option>
              ))}
            </select>
            {fieldErrors.documentType ? (
              <p className="text-sm text-red-600">{fieldErrors.documentType}</p>
            ) : null}
          </div>

          <Input
            label="Numero de documento"
            name="documentNumber"
            value={values.documentNumber}
            onChange={(event) =>
              updateField("documentNumber", event.target.value)
            }
            error={fieldErrors.documentNumber}
            disabled={isLoading}
          />

          <Input
            label="Nombre completo"
            name="fullName"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            error={fieldErrors.fullName}
            autoComplete="name"
            disabled={isLoading}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={fieldErrors.email}
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Telefono"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            error={fieldErrors.phone}
            autoComplete="tel"
            disabled={isLoading}
          />

          <Input
            label="Contrasena"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={fieldErrors.password}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Creando cuenta..."
        >
          Registrarme
        </Button>

        <p className="text-center text-sm text-gray-600">
          Ya tienes cuenta?{" "}
          <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/login">
            Inicia sesion
          </Link>
        </p>
      </form>
    </Card>
  );
}
