import { api } from "@/shared/services/api";
import type { BalanceResponse } from "../types/account.types";

export const accountService = {
  async getBalance(
    documentType: string,
    documentNumber: string,
  ): Promise<BalanceResponse> {
    const encodedDocumentType = encodeURIComponent(documentType);
    const encodedDocumentNumber = encodeURIComponent(documentNumber);

    const response = await api.get<BalanceResponse>(
      `/accounts/balance/${encodedDocumentType}/${encodedDocumentNumber}`,
    );

    return response.data;
  },
};
