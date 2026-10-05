"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { userService } from "@/features/user/services/userService";
import { transactionService } from "../services/transactionService";
import type {
  Transaction,
  TransactionPagination,
} from "../types/transaction.types";

type UseTransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  pagination: TransactionPagination;
};

const PAGE_SIZE = 10;

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
    pagination: {
      page: 1,
      limit: PAGE_SIZE,
      hasNext: false,
      hasPrevious: false,
    },
  });
  const allTransactionsRef = useRef<Transaction[] | null>(null);

  const loadTransactions = useCallback(async (page = 1, force = false) => {
    if (!force && allTransactionsRef.current) {
      const allTransactions = allTransactionsRef.current;
      const totalPages = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));

      setState((currentState) => ({
        ...currentState,
        transactions: allTransactions.slice(
          (page - 1) * PAGE_SIZE,
          page * PAGE_SIZE,
        ),
        isLoading: false,
        error: null,
        pagination: {
          page,
          limit: PAGE_SIZE,
          total: allTransactions.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      }));
      return;
    }

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
          pagination: {
            page,
            limit: PAGE_SIZE,
            hasNext: false,
            hasPrevious: page > 1,
          },
        });
        return;
      }

      const result = await transactionService.getTransactions(
        authenticatedUser.documentType,
        authenticatedUser.documentNumber,
        page,
        PAGE_SIZE,
      );
      allTransactionsRef.current = result.allTransactions ?? result.transactions;

      setState({
        transactions: result.transactions,
        isLoading: false,
        error: null,
        pagination: result.pagination,
      });
    } catch (error) {
      setState({
        transactions: [],
        isLoading: false,
        error: getTransactionsErrorMessage(error),
        pagination: {
          page,
          limit: PAGE_SIZE,
          hasNext: false,
          hasPrevious: page > 1,
        },
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
    pagination: state.pagination,
    reloadTransactions: () => loadTransactions(1, true),
    goToPage: (page: number) => loadTransactions(page),
  };
}
