import Link from "next/link";
import { Card } from "@/shared/components/Card";

export function TransactionActions() {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Operaciones</p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Gestion de puntos
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          href="/accumulate"
        >
          Acumular
        </Link>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
          href="/redeem"
        >
          Redimir
        </Link>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:col-span-2"
          href="/transactions"
        >
          Ver historial
        </Link>
      </div>
    </Card>
  );
}
