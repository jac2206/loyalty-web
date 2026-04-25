import { api } from "@/shared/services/api";
import type {
  AccumulateRequest,
  RedeemRequest,
  Transaction,
  TransactionResponse,
  TransactionsResponse,
} from "../types/transaction.types";

function normalizeTransactionsResponse(
  response: TransactionsResponse,
): Transaction[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response.transactions ?? response.data ?? [];
}

export const transactionService = {
  async accumulate(
    transaction: AccumulateRequest,
  ): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      "/transactions/accumulate",
      transaction,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );

    return response.data;
  },

  async redeem(transaction: RedeemRequest): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      "/transactions/redeem",
      transaction,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );

    return response.data;
  },

  async getTransactions(
    documentType: string,
    documentNumber: string,
  ): Promise<Transaction[]> {
    const encodedDocumentType = encodeURIComponent(documentType);
    const encodedDocumentNumber = encodeURIComponent(documentNumber);
    const response = await api.get<TransactionsResponse>(
      `/transactions/${encodedDocumentType}/${encodedDocumentNumber}`,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );

    return normalizeTransactionsResponse(response.data);
  },
};
