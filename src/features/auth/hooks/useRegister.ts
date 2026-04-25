"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerService } from "../services/registerService";
import type { RegisterCredentials } from "../types/auth.types";

type RegisterFormErrors = Partial<Record<keyof RegisterCredentials, string>>;

type UseRegisterState = {
  values: RegisterCredentials;
  fieldErrors: RegisterFormErrors;
  isLoading: boolean;
  error: string | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const initialValues: RegisterCredentials = {
  documentType: "CC",
  documentNumber: "",
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

function validateRegisterForm(
  values: RegisterCredentials,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!values.documentType) {
    errors.documentType = "Selecciona el tipo de documento.";
  }

  if (!values.documentNumber.trim()) {
    errors.documentNumber = "Ingresa tu numero de documento.";
  }

  if (!values.fullName.trim()) {
    errors.fullName = "Ingresa tu nombre completo.";
  }

  if (!values.email.trim()) {
    errors.email = "Ingresa tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un email valido.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Ingresa tu telefono.";
  }

  if (!values.password) {
    errors.password = "Ingresa una contrasena.";
  } else if (values.password.length < 6) {
    errors.password = "La contrasena debe tener al menos 6 caracteres.";
  }

  return errors;
}

function getRegisterErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos crear tu cuenta.";
  }

  return "No pudimos crear tu cuenta. Intenta nuevamente.";
}

export function useRegister() {
  const router = useRouter();
  const [state, setState] = useState<UseRegisterState>({
    values: initialValues,
    fieldErrors: {},
    isLoading: false,
    error: null,
  });

  function updateField<Field extends keyof RegisterCredentials>(
    field: Field,
    value: RegisterCredentials[Field],
  ) {
    setState((currentState) => ({
      ...currentState,
      values: {
        ...currentState.values,
        [field]: value,
      },
      fieldErrors: {
        ...currentState.fieldErrors,
        [field]: undefined,
      },
      error: null,
    }));
  }

  async function register(credentials: RegisterCredentials) {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      await registerService.register(credentials);
      router.push("/login");
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: getRegisterErrorMessage(error),
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateRegisterForm(state.values);

    if (Object.keys(validationErrors).length > 0) {
      setState((currentState) => ({
        ...currentState,
        fieldErrors: validationErrors,
      }));
      return;
    }

    await register({
      documentType: state.values.documentType,
      documentNumber: state.values.documentNumber.trim(),
      fullName: state.values.fullName.trim(),
      email: state.values.email.trim(),
      phone: state.values.phone.trim(),
      password: state.values.password,
    });
  }

  return {
    values: state.values,
    fieldErrors: state.fieldErrors,
    isLoading: state.isLoading,
    error: state.error,
    updateField,
    handleSubmit,
  };
}
