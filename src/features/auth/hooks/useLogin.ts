"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAuthSession } from "@/shared/services/authStorage";
import { authService } from "../services/authService";
import type { LoginCredentials } from "../types/auth.types";

type UseLoginState = {
  isLoading: boolean;
  error: string | null;
  values: LoginCredentials;
  fieldErrors: LoginFormErrors;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

type LoginFormErrors = Partial<Record<keyof LoginCredentials, string>>;

const initialValues: LoginCredentials = {
  email: "",
  password: "",
};

function validateLoginForm(values: LoginCredentials): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Ingresa tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un email valido.";
  }

  if (!values.password) {
    errors.password = "Ingresa tu contrasena.";
  }

  return errors;
}

function getLoginErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos iniciar sesion.";
  }

  return "No pudimos iniciar sesion. Revisa tus datos e intenta de nuevo.";
}

export function useLogin() {
  const router = useRouter();
  const [state, setState] = useState<UseLoginState>({
    isLoading: false,
    error: null,
    values: initialValues,
    fieldErrors: {},
  });

  async function login(credentials: LoginCredentials) {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await authService.login(credentials);

      saveAuthSession(response.token);
      router.push("/home");
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: getLoginErrorMessage(error),
      }));
    }
  }

  function updateField(field: keyof LoginCredentials, value: string) {
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
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLoginForm(state.values);

    if (Object.keys(validationErrors).length > 0) {
      setState((currentState) => ({
        ...currentState,
        fieldErrors: validationErrors,
      }));
      return;
    }

    await login({
      email: state.values.email.trim(),
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
