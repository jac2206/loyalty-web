"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { UserProfile } from "../types/user.types";

type UseUserState = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

function getUserErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos cargar tu perfil.";
  }

  return "No pudimos cargar tu perfil. Intenta nuevamente.";
}

export function useUser() {
  const [state, setState] = useState<UseUserState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const loadUser = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const user = await userService.getMe();

      setState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: getUserErrorMessage(error),
      });
    }
  }, []);

  useEffect(() => {
    const loadUserTimer = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => window.clearTimeout(loadUserTimer);
  }, [loadUser]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    reloadUser: loadUser,
  };
}
