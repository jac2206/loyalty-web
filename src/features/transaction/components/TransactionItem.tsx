import type { Transaction } from "../types/transaction.types";

type TransactionItemProps = {
  transaction: Transaction;
};

function getTransactionTypeLabel(type?: string): string {
  const normalizedType = type?.toUpperCase();

  if (normalizedType === "ACUM" || normalizedType === "ACCUMULATE") {
    return "ACUM";
  }

  if (normalizedType === "REDEM" || normalizedType === "REDEEM") {
    return "REDEM";
  }

  return normalizedType ?? "TRANS";
}

function getTypeClassName(type?: string): string {
  const normalizedType = getTransactionTypeLabel(type);

  if (normalizedType === "ACUM") {
    return "bg-green-50 text-green-700";
  }

  if (normalizedType === "REDEM") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

function formatPoints(points?: number): string {
  if (points === undefined) {
    return "Sin puntos";
  }

  return `${new Intl.NumberFormat("es-CO").format(points)} pts`;
}

function formatDate(value?: string): string {
  if (!value) {
    return "Fecha no disponible";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const transactionDate = transaction.createdAt ?? transaction.date;
  const transactionType = getTransactionTypeLabel(transaction.type);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTypeClassName(transaction.type)}`}
          >
            {transactionType}
          </span>
          <div>
            <p className="text-lg font-bold text-gray-950">
              {formatPoints(transaction.points)}
            </p>
            <p className="text-sm text-gray-600">{formatDate(transactionDate)}</p>
          </div>
        </div>

        {transaction.status ? (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {transaction.status}
          </span>
        ) : null}
      </div>

      {transaction.reference ? (
        <p className="mt-3 text-sm text-gray-600">
          Referencia:{" "}
          <span className="font-medium text-gray-900">
            {transaction.reference}
          </span>
        </p>
      ) : null}
    </article>
  );
}
