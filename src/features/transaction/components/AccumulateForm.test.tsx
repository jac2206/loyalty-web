import type { FormEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransaction } from "../hooks/useTransaction";
import { AccumulateForm } from "./AccumulateForm";

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

describe("AccumulateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders accumulate fields and navigation link", () => {
    mockUseTransaction();

    render(<AccumulateForm />);

    expect(
      screen.getByRole("heading", { name: "Acumular puntos" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Codigo aliado")).toBeInTheDocument();
    expect(screen.getByLabelText("Codigo sede")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor de compra")).toBeInTheDocument();
    expect(screen.getByLabelText("Referencia")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver" })).toHaveAttribute(
      "href",
      "/home",
    );
  });

  it("calls updateAccumulateField when inputs change", () => {
    const updateAccumulateField = vi.fn();
    mockUseTransaction({ updateAccumulateField });

    render(<AccumulateForm />);

    fireEvent.change(screen.getByLabelText("Codigo aliado"), {
      target: { value: "PARTNER_001" },
    });
    fireEvent.change(screen.getByLabelText("Codigo sede"), {
      target: { value: "LOC_001" },
    });
    fireEvent.change(screen.getByLabelText("Valor de compra"), {
      target: { value: "200000" },
    });
    fireEvent.change(screen.getByLabelText("Referencia"), {
      target: { value: "COMPRA-001" },
    });

    expect(updateAccumulateField).toHaveBeenCalledWith(
      "partnerCode",
      "PARTNER_001",
    );
    expect(updateAccumulateField).toHaveBeenCalledWith(
      "locationCode",
      "LOC_001",
    );
    expect(updateAccumulateField).toHaveBeenCalledWith("amount", "200000");
    expect(updateAccumulateField).toHaveBeenCalledWith(
      "reference",
      "COMPRA-001",
    );
  });

  it("submits the form through the hook handler", () => {
    const handleAccumulateSubmit = vi.fn(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      },
    );
    mockUseTransaction({ handleAccumulateSubmit });

    render(<AccumulateForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Acumular puntos" }));

    expect(handleAccumulateSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders errors, success message and loading state", () => {
    mockUseTransaction({
      isLoading: true,
      error: "No pudimos procesar la transaccion.",
      success: "Puntos acumulados correctamente.",
      transaction: {
        balance: 1500,
      },
      accumulateFieldErrors: {
        amount: "El valor debe ser mayor a cero.",
      },
    });

    render(<AccumulateForm />);

    expect(
      screen.getByText("No pudimos procesar la transaccion."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Puntos acumulados correctamente."),
    ).toBeInTheDocument();
    expect(screen.getByText("Nuevo saldo: 1.500 puntos.")).toBeInTheDocument();
    expect(screen.getByText("El valor debe ser mayor a cero.")).toBeInTheDocument();
    expect(screen.getByLabelText("Codigo aliado")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Acumulando..." }),
    ).toBeDisabled();
  });
});
