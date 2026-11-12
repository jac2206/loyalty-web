import type { FormEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransaction } from "../hooks/useTransaction";
import { RedeemForm } from "./RedeemForm";

vi.mock("../hooks/useTransaction", () => ({
  useTransaction: vi.fn(),
}));

const mockedUseTransaction = vi.mocked(useTransaction);

function mockUseTransaction(
  overrides: Partial<ReturnType<typeof useTransaction>> = {},
) {
  const defaultReturn: ReturnType<typeof useTransaction> = {
    accumulateValues: {
      partnerCode: "",
      locationCode: "",
      amount: "",
      reference: "",
    },
    accumulateFieldErrors: {},
    redeemValues: {
      partnerCode: "",
      locationCode: "",
      points: "",
      reference: "",
    },
    redeemFieldErrors: {},
    isLoading: false,
    error: null,
    success: null,
    transaction: null,
    updateAccumulateField: vi.fn(),
    updateRedeemField: vi.fn(),
    handleAccumulateSubmit: vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    }),
    handleRedeemSubmit: vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    }),
  };

  mockedUseTransaction.mockReturnValue({
    ...defaultReturn,
    ...overrides,
  });

  return {
    ...defaultReturn,
    ...overrides,
  };
}

describe("RedeemForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders redeem fields and navigation link", () => {
    mockUseTransaction();

    render(<RedeemForm />);

    expect(
      screen.getByRole("heading", { name: "Redimir puntos" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Código aliado")).toBeInTheDocument();
    expect(screen.getByLabelText("Código sede")).toBeInTheDocument();
    expect(screen.getByLabelText("Puntos")).toBeInTheDocument();
    expect(screen.getByLabelText("Referencia")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver" })).toHaveAttribute(
      "href",
      "/home",
    );
  });

  it("calls updateRedeemField when inputs change", () => {
    const updateRedeemField = vi.fn();
    mockUseTransaction({ updateRedeemField });

    render(<RedeemForm />);

    fireEvent.change(screen.getByLabelText("Código aliado"), {
      target: { value: "PARTNER_001" },
    });
    fireEvent.change(screen.getByLabelText("Código sede"), {
      target: { value: "LOC_001" },
    });
    fireEvent.change(screen.getByLabelText("Puntos"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText("Referencia"), {
      target: { value: "REDEM-001" },
    });

    expect(updateRedeemField).toHaveBeenCalledWith(
      "partnerCode",
      "PARTNER_001",
    );
    expect(updateRedeemField).toHaveBeenCalledWith("locationCode", "LOC_001");
    expect(updateRedeemField).toHaveBeenCalledWith("points", "500");
    expect(updateRedeemField).toHaveBeenCalledWith("reference", "REDEM-001");
  });

  it("submits the form through the hook handler", () => {
    const handleRedeemSubmit = vi.fn(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      },
    );
    mockUseTransaction({ handleRedeemSubmit });

    render(<RedeemForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Redimir puntos" }));

    expect(handleRedeemSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders errors, success message and loading state", () => {
    mockUseTransaction({
      isLoading: true,
      error: "No pudimos procesar la transaccion.",
      success: "Puntos redimidos correctamente.",
      transaction: {
        balance: 700,
      },
      redeemFieldErrors: {
        points: "Los puntos deben ser un entero mayor a cero.",
      },
    });

    render(<RedeemForm />);

    expect(
      screen.getByText("No pudimos procesar la transaccion."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Puntos redimidos correctamente."),
    ).toBeInTheDocument();
    expect(screen.getByText("Nuevo saldo: 700 puntos.")).toBeInTheDocument();
    expect(
      screen.getByText("Los puntos deben ser un entero mayor a cero."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Código aliado")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Redimiendo..." }),
    ).toBeDisabled();
  });
});
