"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/user/services/userService";
import { transactionService } from "../services/transactionService";
import type { Transaction } from "../types/transaction.types";

type UseTransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

function getTransactionsErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos cargar el historial.";
  }

  return "No pudimos cargar el historial. Intenta nuevamente.";
}

export function useTransactions() {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    isLoading: true,
    error: null,
  });

  const loadTransactions = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const authenticatedUser = await userService.getMe();

      if (!authenticatedUser.documentType || !authenticatedUser.documentNumber) {
        setState({
          transactions: [],
          isLoading: false,
          error: "Tu perfil no tiene documento para consultar historial.",
        });
        return;
      }

      const transactions = await transactionService.getTransactions(
        authenticatedUser.documentType,
        authenticatedUser.documentNumber,
      );

      setState({
        transactions,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        transactions: [],
        isLoading: false,
        error: getTransactionsErrorMessage(error),
      });
    }
  }, []);

  useEffect(() => {
    const loadTransactionsTimer = window.setTimeout(() => {
      void loadTransactions();
    }, 0);

    return () => window.clearTimeout(loadTransactionsTimer);
  }, [loadTransactions]);

  return {
    transactions: state.transactions,
    isLoading: state.isLoading,
    error: state.error,
    reloadTransactions: loadTransactions,
  };
}
