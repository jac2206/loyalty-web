"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionItem } from "./TransactionItem";

export function TransactionList() {
  const { transactions, isLoading, error, reloadTransactions } =
    useTransactions();

  return (
    <Card className="w-full max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Historial
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Transacciones
          </h1>
          <p className="text-sm text-gray-600">
            Consulta los movimientos de puntos de la cuenta autenticada.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            href="/home"
          >
            Volver
          </Link>
          <Button
            type="button"
            onClick={() => void reloadTransactions()}
            className="w-auto px-5"
            disabled={isLoading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            <Button
              type="button"
              onClick={() => void reloadTransactions()}
              className="w-auto px-5"
            >
              Reintentar
            </Button>
          </div>
        ) : null}

        {!isLoading && !error && transactions.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            No hay transacciones
          </div>
        ) : null}

        {!isLoading && !error && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id ?? `${transaction.type}-${index}`}
                transaction={transaction}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
