"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/user/services/userService";
import { accountService } from "../services/accountService";

type UseBalanceState = {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

function getBalanceErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos cargar tu saldo.";
  }

  return "No pudimos cargar tu saldo. Intenta nuevamente.";
}

export function useBalance() {
  const [state, setState] = useState<UseBalanceState>({
    balance: null,
    isLoading: true,
    error: null,
  });

  const loadBalance = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const authenticatedUser = await userService.getMe();

      if (!authenticatedUser.documentType || !authenticatedUser.documentNumber) {
        setState({
          balance: null,
          isLoading: false,
          error: "Tu perfil no tiene documento para consultar saldo.",
        });
        return;
      }

      const response = await accountService.getBalance(
        authenticatedUser.documentType,
        authenticatedUser.documentNumber,
      );

      setState({
        balance: response.balance,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        balance: null,
        isLoading: false,
        error: getBalanceErrorMessage(error),
      });
    }
  }, []);

  useEffect(() => {
    const loadBalanceTimer = window.setTimeout(() => {
      void loadBalance();
    }, 0);

    return () => window.clearTimeout(loadBalanceTimer);
  }, [loadBalance]);

  return {
    balance: state.balance,
    isLoading: state.isLoading,
    error: state.error,
    reloadBalance: loadBalance,
  };
}
