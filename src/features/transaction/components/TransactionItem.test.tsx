import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionItem } from "./TransactionItem";

describe("TransactionItem", () => {
  it("renders accumulate transaction details", () => {
    render(
      <TransactionItem
        transaction={{
          type: "ACCUMULATE",
          points: 1200,
          reference: "COMPRA-001",
          status: "APPROVED",
          createdAt: "2026-04-25T15:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("ACUM")).toBeInTheDocument();
    expect(screen.getByText("1.200 pts")).toBeInTheDocument();
    expect(screen.getByText("APPROVED")).toBeInTheDocument();
    expect(screen.getByText("COMPRA-001")).toBeInTheDocument();
  });

  it("renders fallbacks for missing values", () => {
    render(<TransactionItem transaction={{}} />);

    expect(screen.getByText("TRANS")).toBeInTheDocument();
    expect(screen.getByText("Sin puntos")).toBeInTheDocument();
    expect(screen.getByText("Fecha no disponible")).toBeInTheDocument();
  });
});
