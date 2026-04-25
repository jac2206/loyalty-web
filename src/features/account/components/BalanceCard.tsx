"use client";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useBalance } from "../hooks/useBalance";

function formatBalance(balance: number): string {
  return new Intl.NumberFormat("es-CO").format(balance);
}

export function BalanceCard() {
  const { balance, isLoading, error, reloadBalance } = useBalance();

  return (
    <Card className="overflow-hidden border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 p-0 shadow-md">
      <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4">
        <div>
          <p className="text-sm font-medium text-blue-700">Saldo disponible</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Cuenta de puntos
          </h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          Loyalty
        </span>
      </div>

      <div className="space-y-4 px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-blue-100" />
            <div className="h-12 w-48 animate-pulse rounded bg-blue-200" />
            <p className="text-sm text-gray-600">Cargando saldo...</p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            <Button
              type="button"
              onClick={() => void reloadBalance()}
              className="w-auto px-5"
            >
              Reintentar
            </Button>
          </div>
        ) : null}

        {!isLoading && !error && balance !== null ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Puntos acumulados</p>
            <p className="text-5xl font-bold tracking-tight text-gray-950">
              {formatBalance(balance)}
            </p>
            <p className="text-sm text-gray-600">
              Tu saldo esta listo para futuras redenciones.
            </p>
          </div>
        ) : null}

        {!isLoading && !error && balance === null ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            Aun no hay saldo disponible para mostrar.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
