import { api } from "@/shared/services/api";
import type {
  AccumulateRequest,
  RedeemRequest,
  Transaction,
  PaginatedTransactions,
  TransactionPagination,
  TransactionResponse,
  TransactionsEnvelope,
  TransactionsResponse,
} from "../types/transaction.types";

const DEFAULT_PAGE_SIZE = 10;

function normalizeTransactionsResponse(
  response: TransactionsResponse,
  page: number,
  limit: number,
): PaginatedTransactions {
  const extractEnvelope = (
    value: TransactionsResponse | TransactionsEnvelope,
  ): { transactions: Transaction[]; envelope: TransactionsEnvelope } => {
    if (Array.isArray(value)) {
      return { transactions: value, envelope: {} };
    }

    if (Array.isArray(value.transactions)) {
      return { transactions: value.transactions, envelope: value };
    }

    if (Array.isArray(value.data)) {
      return { transactions: value.data, envelope: value };
    }

    if (value.data) {
      const nested = extractEnvelope(value.data);
      return { transactions: nested.transactions, envelope: { ...nested.envelope, ...value } };
    }

    return { transactions: [], envelope: value };
  };

  const { transactions: allTransactions, envelope } = extractEnvelope(response);
  const total = envelope.total ?? allTransactions.length;
  const totalPages = Math.max(1, envelope.totalPages ?? Math.ceil(total / limit));
  const transactions = allTransactions.slice((page - 1) * limit, page * limit);
  const pagination: TransactionPagination = {
    page,
    limit,
    total,
    totalPages,
    hasNext:
      envelope.hasNext ?? page < totalPages,
    hasPrevious:
      envelope.hasPrevious ?? page > 1,
  };

  return { transactions, allTransactions, pagination };
}

export const transactionService = {
  async accumulate(
    transaction: AccumulateRequest,
  ): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      "/transactions/accumulate",
      transaction,
    );

    return response.data;
  },

  async redeem(transaction: RedeemRequest): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      "/transactions/redeem",
      transaction,
    );

    return response.data;
  },

  async getTransactions(
    documentType: string,
    documentNumber: string,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  ): Promise<PaginatedTransactions> {
    const encodedDocumentType = encodeURIComponent(documentType);
    const encodedDocumentNumber = encodeURIComponent(documentNumber);
    const response = await api.get<TransactionsResponse>(
      `/transactions/${encodedDocumentType}/${encodedDocumentNumber}`,
    );

    return normalizeTransactionsResponse(response.data, page, limit);
  },
};
