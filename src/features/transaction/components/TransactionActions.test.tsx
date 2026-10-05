import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionActions } from "./TransactionActions";

describe("TransactionActions", () => {
  it("renders transaction operation links", () => {
    render(<TransactionActions />);

    expect(screen.getByRole("link", { name: "Acumular" })).toHaveAttribute(
      "href",
      "/accumulate",
    );
    expect(screen.getByRole("link", { name: "Redimir" })).toHaveAttribute(
      "href",
      "/redeem",
    );
    expect(screen.getByRole("link", { name: "Ver historial" })).toHaveAttribute(
      "href",
      "/transactions",
    );
  });
});
