import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/shared/services/api";
import { transactionService } from "./transactionService";

vi.mock("@/shared/services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApiGet = vi.mocked(api.get);
const mockedApiPost = vi.mocked(api.post);

describe("transactionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts accumulate data with admin role header and returns response data", async () => {
    const transaction = {
      documentType: "CC",
      documentNumber: "123456",
      partnerCode: "PARTNER_001",
      locationCode: "LOC_001",
      amount: 200000,
      reference: "COMPRA-001",
    };
    const response = {
      id: "tx-1",
      type: "ACUM",
      points: 200,
      balance: 1200,
    };

    mockedApiPost.mockResolvedValueOnce({ data: response });

    await expect(transactionService.accumulate(transaction)).resolves.toEqual(
      response,
    );

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/transactions/accumulate",
      transaction,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );
  });

  it("posts redeem data with admin role header and returns response data", async () => {
    const transaction = {
      documentType: "CC",
      documentNumber: "123456",
      partnerCode: "PARTNER_001",
      locationCode: "LOC_001",
      points: 500,
      reference: "REDEM-001",
    };
    const response = {
      id: "tx-2",
      type: "REDEM",
      points: 500,
      balance: 700,
    };

    mockedApiPost.mockResolvedValueOnce({ data: response });

    await expect(transactionService.redeem(transaction)).resolves.toEqual(
      response,
    );

    expect(mockedApiPost).toHaveBeenCalledWith(
      "/transactions/redeem",
      transaction,
      {
        headers: {
          "x-user-role": "adm",
        },
      },
    );
  });

  it("gets encoded transactions and normalizes wrapped responses", async () => {
    const transactions = [
      {
        id: "tx-1",
        type: "ACUM",
        points: 100,
      },
    ];

    mockedApiGet.mockResolvedValueOnce({ data: { transactions } });

    await expect(
      transactionService.getTransactions("CC Especial", "123/456"),
    ).resolves.toEqual({
      transactions,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    });

    expect(mockedApiGet).toHaveBeenCalledWith(
      "/transactions/CC%20Especial/123%2F456",
    );
  });

  it("normalizes array, data wrapper and empty transaction responses", async () => {
    const firstTransactions = [{ id: "tx-1", type: "ACUM" }];
    const secondTransactions = [{ id: "tx-2", type: "REDEM" }];

    mockedApiGet
      .mockResolvedValueOnce({ data: firstTransactions })
      .mockResolvedValueOnce({ data: { data: secondTransactions } })
      .mockResolvedValueOnce({ data: {} });

    await expect(transactionService.getTransactions("CC", "1")).resolves.toMatchObject({
      transactions: firstTransactions,
    });
    await expect(transactionService.getTransactions("CC", "2")).resolves.toMatchObject({
      transactions: secondTransactions,
    });
    await expect(transactionService.getTransactions("CC", "3")).resolves.toMatchObject({
      transactions: [],
    });
  });

  it("propagates api errors", async () => {
    const error = new Error("Network error");

    mockedApiGet.mockRejectedValueOnce(error);

    await expect(transactionService.getTransactions("CC", "1")).rejects.toThrow(
      "Network error",
    );
  });
});
