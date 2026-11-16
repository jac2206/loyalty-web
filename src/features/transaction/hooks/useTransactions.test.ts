import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userService } from "@/features/user/services/userService";
import { transactionService } from "../services/transactionService";
import { useTransactions } from "./useTransactions";

vi.mock("@/features/user/services/userService", () => ({
  userService: {
    getMe: vi.fn(),
  },
}));

vi.mock("../services/transactionService", () => ({
  transactionService: {
    getTransactions: vi.fn(),
  },
}));

const mockedGetMe = vi.mocked(userService.getMe);
const mockedGetTransactions = vi.mocked(transactionService.getTransactions);

async function runInitialTimer() {
  await act(async () => {
    vi.runOnlyPendingTimers();
  });
}

describe("useTransactions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  it("loads transactions for the authenticated user", async () => {
    const transactions = [
      {
        id: "tx-1",
        type: "ACUM",
        points: 100,
      },
    ];

    mockedGetMe.mockResolvedValueOnce({
      id: "user-1",
      documentType: "CC",
      documentNumber: "123456",
    });
    mockedGetTransactions.mockResolvedValueOnce({
      transactions,
      pagination: {
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrevious: false,
      },
    });

    const { result } = renderHook(() => useTransactions());

    await runInitialTimer();

    expect(mockedGetTransactions).toHaveBeenCalledWith("CC", "123456", 1, 10);
    expect(result.current.transactions).toEqual(transactions);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when the authenticated user has no document", async () => {
    mockedGetMe.mockResolvedValueOnce({
      id: "user-1",
      documentType: "",
      documentNumber: "",
    });

    const { result } = renderHook(() => useTransactions());

    await runInitialTimer();

    expect(mockedGetTransactions).not.toHaveBeenCalled();
    expect(result.current.transactions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      "Tu perfil no tiene documento para consultar historial.",
    );
  });

  it("sets api error messages and allows reloading transactions", async () => {
    mockedGetMe.mockResolvedValue({
      id: "user-1",
      documentType: "CC",
      documentNumber: "123456",
    });
    mockedGetTransactions
      .mockRejectedValueOnce({
        response: {
          data: {
            message: "Historial no disponible",
          },
        },
      })
      .mockResolvedValueOnce({
        transactions: [{ id: "tx-2", type: "REDEM", points: 50 }],
        pagination: {
          page: 1,
          limit: 10,
          hasNext: false,
          hasPrevious: false,
        },
      });

    const { result } = renderHook(() => useTransactions());

    await runInitialTimer();

    expect(result.current.error).toBe("Historial no disponible");

    await act(async () => {
      await result.current.reloadTransactions();
    });

    expect(result.current.transactions).toEqual([
      { id: "tx-2", type: "REDEM", points: 50 },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("navigates a complete history without requesting it again", async () => {
    const allTransactions = Array.from({ length: 21 }, (_, index) => ({ id: String(index), type: "ACUM" }));
    mockedGetMe.mockResolvedValueOnce({ documentType: "CC", documentNumber: "123456" });
    mockedGetTransactions.mockResolvedValueOnce({
      transactions: allTransactions.slice(0, 10), allTransactions,
      pagination: { page: 1, limit: 10, total: 21, totalPages: 3, hasNext: true, hasPrevious: false },
    });
    const { result } = renderHook(() => useTransactions());
    await runInitialTimer();
    await act(async () => { await result.current.goToPage(3); });
    expect(result.current.transactions).toEqual(allTransactions.slice(20));
    expect(result.current.pagination).toMatchObject({ page: 3, hasNext: false, hasPrevious: true });
    expect(mockedGetTransactions).toHaveBeenCalledTimes(1);
  });
});
