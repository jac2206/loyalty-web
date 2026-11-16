"use client";

import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { UpdateUserRequest, UserProfile } from "../types/user.types";

type UpdateUserState = {
  user: UserProfile | null;
  values: UpdateUserRequest;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  fieldErrors: Partial<Record<keyof UpdateUserRequest, string>>;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const emptyValues: UpdateUserRequest = { fullName: "", email: "" };

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;
    return data.message ?? data.error ?? fallback;
  }

  return fallback;
}

function getFullName(user: UserProfile): string {
  return (
    user.fullName ??
    user.name ??
    [user.firstName, user.lastName].filter(Boolean).join(" ")
  );
}

export function useUpdateUser() {
  const [state, setState] = useState<UpdateUserState>({
    user: null,
    values: emptyValues,
    isLoading: true,
    isSaving: false,
    error: null,
    success: null,
    fieldErrors: {},
  });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      setState((current) => ({ ...current, isLoading: true, error: null }));
      try {
        const user = await userService.getMe();
        if (!isActive) return;

        setState((current) => ({
          ...current,
          user,
          values: { fullName: getFullName(user), email: user.email ?? "" },
          isLoading: false,
        }));
      } catch (error) {
        if (!isActive) return;
        setState((current) => ({
          ...current,
          isLoading: false,
          error: getErrorMessage(error, "No pudimos cargar tu perfil."),
        }));
      }
    }

    void loadUser();
    return () => {
      isActive = false;
    };
  }, [loadAttempt]);

  function updateField(field: keyof UpdateUserRequest, value: string) {
    setState((current) => ({
      ...current,
      values: { ...current.values, [field]: value },
      fieldErrors: { ...current.fieldErrors, [field]: undefined },
      error: null,
      success: null,
    }));
  }

  async function saveUser() {
    const fullName = state.values.fullName.trim();
    const email = state.values.email.trim();

    const fieldErrors: UpdateUserState["fieldErrors"] = {};
    if (!fullName) fieldErrors.fullName = "Ingresa tu nombre completo.";
    if (!email) fieldErrors.email = "Ingresa tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Ingresa un correo electrónico válido.";
    }
    if (Object.keys(fieldErrors).length > 0) {
      setState((current) => ({
        ...current,
        fieldErrors,
        error: null,
        success: null,
      }));
      return;
    }

    const documentNumber = state.user?.documentNumber;
    if (!documentNumber) {
      setState((current) => ({
        ...current,
        error: "No encontramos el identificador de tu usuario.",
        success: null,
      }));
      return;
    }

    setState((current) => ({ ...current, isSaving: true, error: null, success: null, fieldErrors: {} }));

    try {
      await userService.updateUser(documentNumber, { fullName, email });
      setState((current) => ({
        ...current,
        user: current.user
          ? { ...current.user, fullName, name: fullName, firstName: undefined, lastName: undefined, email }
          : current.user,
        values: { fullName, email },
        isSaving: false,
        success: "Tus datos se actualizaron correctamente.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        isSaving: false,
        error: getErrorMessage(error, "No pudimos actualizar tus datos. Intenta nuevamente."),
      }));
    }
  }

  return { ...state, updateField, saveUser, reloadUser: () => setLoadAttempt((attempt) => attempt + 1) };
}
