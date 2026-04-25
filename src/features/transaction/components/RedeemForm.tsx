"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { useTransaction } from "../hooks/useTransaction";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function RedeemForm() {
  const {
    redeemValues,
    redeemFieldErrors,
    isLoading,
    error,
    success,
    transaction,
    updateRedeemField,
    handleRedeemSubmit,
  } = useTransaction();

  return (
    <Card className="w-full max-w-lg">
      <form className="space-y-6" onSubmit={handleRedeemSubmit} noValidate>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Transaccion
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Redimir puntos</h1>
          <p className="text-sm text-gray-600">
            Registra los puntos que se descontaran de la cuenta autenticada.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
            {transaction?.balance !== undefined ? (
              <span className="block pt-1 font-semibold">
                Nuevo saldo: {formatNumber(transaction.balance)} puntos.
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-4">
          <Input
            label="Codigo aliado"
            name="partnerCode"
            value={redeemValues.partnerCode}
            onChange={(event) =>
              updateRedeemField("partnerCode", event.target.value)
            }
            error={redeemFieldErrors.partnerCode}
            placeholder="PARTNER_001"
            disabled={isLoading}
          />

          <Input
            label="Codigo sede"
            name="locationCode"
            value={redeemValues.locationCode}
            onChange={(event) =>
              updateRedeemField("locationCode", event.target.value)
            }
            error={redeemFieldErrors.locationCode}
            placeholder="LOC_001"
            disabled={isLoading}
          />

          <Input
            label="Puntos"
            name="points"
            type="number"
            min="1"
            step="1"
            value={redeemValues.points}
            onChange={(event) => updateRedeemField("points", event.target.value)}
            error={redeemFieldErrors.points}
            placeholder="500"
            disabled={isLoading}
          />

          <Input
            label="Referencia"
            name="reference"
            value={redeemValues.reference}
            onChange={(event) =>
              updateRedeemField("reference", event.target.value)
            }
            error={redeemFieldErrors.reference}
            placeholder="COMPRA-REDEM-001"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Redimiendo..."
          >
            Redimir puntos
          </Button>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
            href="/home"
          >
            Volver
          </Link>
        </div>
      </form>
    </Card>
  );
}
