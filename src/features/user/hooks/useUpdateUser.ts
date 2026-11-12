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
  });

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
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
  }, []);

  function updateField(field: keyof UpdateUserRequest, value: string) {
    setState((current) => ({
      ...current,
      values: { ...current.values, [field]: value },
      error: null,
      success: null,
    }));
  }

  async function saveUser() {
    const fullName = state.values.fullName.trim();
    const email = state.values.email.trim();

    if (!fullName || !email) {
      setState((current) => ({
        ...current,
        error: "Ingresa tu nombre y correo electrónico.",
        success: null,
      }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState((current) => ({
        ...current,
        error: "Ingresa un correo electrónico válido.",
        success: null,
      }));
      return;
    }

    const userId = state.user?.id ?? state.user?.documentNumber;
    if (!userId) {
      setState((current) => ({
        ...current,
        error: "No encontramos el identificador de tu usuario.",
        success: null,
      }));
      return;
    }

    setState((current) => ({ ...current, isSaving: true, error: null, success: null }));

    try {
      await userService.updateUser(userId, { fullName, email });
      setState((current) => ({
        ...current,
        user: current.user
          ? { ...current.user, name: fullName, firstName: undefined, lastName: undefined, email }
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

  return { ...state, updateField, saveUser };
}
