"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionItem } from "./TransactionItem";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPageItems(totalPages: number, currentPage: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "ellipsis-left",
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

export function TransactionList() {
  const {
    transactions,
    isLoading,
    error,
    pagination,
    reloadTransactions,
    goToPage,
  } = useTransactions();
  const pageItems = pagination.totalPages
    ? getPageItems(pagination.totalPages, pagination.page)
    : [];

  return (
    <Card className="history-card w-full max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Tu cuenta · Historial
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Transacciones
          </h1>
          <p className="text-sm text-gray-600">
            Consulta el detalle de tus acumulaciones y redenciones.
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
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          <div className="history-empty">
            <span className="history-empty-icon"><Icon name="list" /></span>
            <p className="history-empty-title">No hay transacciones</p>
            <p>Aquí aparecerán los movimientos de tu cuenta.</p>
            <Link href="/accumulate">Acumular puntos <Icon name="arrow" /></Link>
          </div>
        ) : null}

        {!isLoading && !error && transactions.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id ?? `${transaction.type}-${index}`}
                  transaction={transaction}
                />
              ))}
            </div>
            <div className="flex justify-center border-t border-gray-200 pt-4">
              <div className="flex min-w-0 max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-white px-3 py-2 shadow-sm">
                <Button
                  type="button"
                  onClick={() => void goToPage(pagination.page - 1)}
                  disabled={isLoading || !pagination.hasPrevious}
                  aria-label="Página anterior"
                  className="!h-9 !w-9 shrink-0 bg-gray-100 !px-0 text-xl leading-none !text-gray-400 hover:bg-gray-200 disabled:bg-gray-100 disabled:!text-gray-300"
                >
                  ‹
                </Button>
                {pageItems.map((pageItem) =>
                  typeof pageItem === "number" ? (
                    <Button
                      key={pageItem}
                      type="button"
                      onClick={() => void goToPage(pageItem)}
                      disabled={isLoading}
                      aria-current={
                        pageItem === pagination.page ? "page" : undefined
                      }
                      className={`!h-9 !min-w-9 !w-9 shrink-0 !px-2 text-sm ${
                        pageItem === pagination.page
                          ? "bg-blue-500 !text-white hover:bg-blue-600"
                          : "bg-transparent !text-gray-400 shadow-none hover:bg-gray-100 hover:!text-gray-600"
                      }`}
                    >
                      {pageItem}
                    </Button>
                  ) : (
                    <span
                      key={pageItem}
                      className="px-1 text-sm font-semibold text-gray-500"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ),
                )}
                <Button
                  type="button"
                  onClick={() => void goToPage(pagination.page + 1)}
                  disabled={isLoading || !pagination.hasNext}
                  aria-label="Página siguiente"
                  className="!h-9 !w-9 shrink-0 bg-gray-100 !px-0 text-xl leading-none !text-gray-400 hover:bg-gray-200 disabled:bg-gray-100 disabled:!text-gray-300"
                >
                  ›
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
