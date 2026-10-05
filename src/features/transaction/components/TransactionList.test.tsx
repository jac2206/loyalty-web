import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionList } from "./TransactionList";

vi.mock("../hooks/useTransactions", () => ({
  useTransactions: vi.fn(),
}));

const mockedUseTransactions = vi.mocked(useTransactions);

function mockUseTransactions(
  overrides: Partial<ReturnType<typeof useTransactions>> = {},
) {
  const defaultReturn: ReturnType<typeof useTransactions> = {
    transactions: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrevious: false,
    },
    reloadTransactions: vi.fn(),
    goToPage: vi.fn(),
  };

  mockedUseTransactions.mockReturnValue({
    ...defaultReturn,
    ...overrides,
  });

  return {
    ...defaultReturn,
    ...overrides,
  };
}

describe("TransactionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading, navigation and empty state", () => {
    mockUseTransactions();

    render(<TransactionList />);

    expect(
      screen.getByRole("heading", { name: "Transacciones" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver" })).toHaveAttribute(
      "href",
      "/home",
    );
    expect(screen.getByText("No hay transacciones")).toBeInTheDocument();
  });

  it("renders loading placeholders and disables update button", () => {
    mockUseTransactions({ isLoading: true });

    render(<TransactionList />);

    expect(screen.getByRole("button", { name: "Actualizar" })).toBeDisabled();
    expect(screen.queryByText("No hay transacciones")).not.toBeInTheDocument();
  });

  it("renders error and retries through reloadTransactions", () => {
    const reloadTransactions = vi.fn();
    mockUseTransactions({
      error: "No pudimos cargar el historial.",
      reloadTransactions,
    });

    render(<TransactionList />);

    expect(screen.getByText("No pudimos cargar el historial.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(reloadTransactions).toHaveBeenCalledTimes(1);
  });

  it("renders transactions and updates through reloadTransactions", () => {
    const reloadTransactions = vi.fn();
    mockUseTransactions({
      reloadTransactions,
      transactions: [
        {
          id: "tx-1",
          type: "ACUM",
          points: 1000,
          reference: "COMPRA-001",
          status: "APPROVED",
          createdAt: "2026-04-25T15:00:00.000Z",
        },
      ],
    });

    render(<TransactionList />);

    expect(screen.getByText("ACUM")).toBeInTheDocument();
    expect(screen.getByText("1.000 pts")).toBeInTheDocument();
    expect(screen.getByText("COMPRA-001")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    expect(reloadTransactions).toHaveBeenCalledTimes(1);
  });
});
