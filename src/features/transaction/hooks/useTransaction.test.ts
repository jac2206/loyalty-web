import type { FormEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userService } from "@/features/user/services/userService";
import { transactionService } from "../services/transactionService";
import { useTransaction } from "./useTransaction";

vi.mock("@/features/user/services/userService", () => ({
  userService: {
    getMe: vi.fn(),
  },
}));

vi.mock("../services/transactionService", () => ({
  transactionService: {
    accumulate: vi.fn(),
    redeem: vi.fn(),
  },
}));

const mockedGetMe = vi.mocked(userService.getMe);
const mockedAccumulate = vi.mocked(transactionService.accumulate);
const mockedRedeem = vi.mocked(transactionService.redeem);

function submitEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as FormEvent<HTMLFormElement>;
}

describe("useTransaction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("updates accumulate fields and clears the edited field error", async () => {
    const { result } = renderHook(() => useTransaction());

    await act(async () => {
      await result.current.handleAccumulateSubmit(submitEvent());
    });

    expect(result.current.accumulateFieldErrors.partnerCode).toBe(
      "Ingresa el codigo del aliado.",
    );

    act(() => {
      result.current.updateAccumulateField("partnerCode", "PARTNER_001");
    });

    expect(result.current.accumulateValues.partnerCode).toBe("PARTNER_001");
    expect(result.current.accumulateFieldErrors.partnerCode).toBeUndefined();
  });

  it("sets accumulate validation errors and does not call services when values are invalid", async () => {
    const { result } = renderHook(() => useTransaction());
    const event = submitEvent();

    await act(async () => {
      await result.current.handleAccumulateSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.accumulateFieldErrors).toEqual({
      partnerCode: "Ingresa el codigo del aliado.",
      locationCode: "Ingresa el codigo de la sede.",
      amount: "Ingresa el valor de la compra.",
      reference: "Ingresa la referencia de la compra.",
    });
    expect(mockedGetMe).not.toHaveBeenCalled();
    expect(mockedAccumulate).not.toHaveBeenCalled();
  });

  it("updates redeem fields and clears the edited field error", async () => {
    const { result } = renderHook(() => useTransaction());

    await act(async () => {
      await result.current.handleRedeemSubmit(submitEvent());
    });

    expect(result.current.redeemFieldErrors.points).toBe(
      "Ingresa los puntos a redimir.",
    );

    act(() => {
      result.current.updateRedeemField("points", "500");
    });

    expect(result.current.redeemValues.points).toBe("500");
    expect(result.current.redeemFieldErrors.points).toBeUndefined();
  });

  it("sets redeem validation errors and does not call services when values are invalid", async () => {
    const { result } = renderHook(() => useTransaction());
    const event = submitEvent();

    await act(async () => {
      await result.current.handleRedeemSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.redeemFieldErrors).toEqual({
      partnerCode: "Ingresa el codigo del aliado.",
      locationCode: "Ingresa el codigo de la sede.",
      points: "Ingresa los puntos a redimir.",
      reference: "Ingresa la referencia de la redencion.",
    });
    expect(mockedGetMe).not.toHaveBeenCalled();
    expect(mockedRedeem).not.toHaveBeenCalled();
  });
});
