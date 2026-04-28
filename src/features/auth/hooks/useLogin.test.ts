import type { FormEvent } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../services/authService";
import { useLogin } from "./useLogin";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/shared/services/authStorage", () => ({
  saveAuthSession: vi.fn(),
}));

vi.mock("../services/authService", () => ({
  authService: {
    login: vi.fn(),
  },
}));

const mockedLogin = vi.mocked(authService.login);

function submitEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as FormEvent<HTMLFormElement>;
}

describe("useLogin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("updates fields and clears the field error for the edited field", async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.fieldErrors.email).toBe("Ingresa tu email.");

    act(() => {
      result.current.updateField("email", "ana@example.com");
    });

    expect(result.current.values.email).toBe("ana@example.com");
    expect(result.current.fieldErrors.email).toBeUndefined();
  });

  it("sets validation errors and does not call the service when fields are invalid", async () => {
    const { result } = renderHook(() => useLogin());
    const event = submitEvent();

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.fieldErrors).toEqual({
      email: "Ingresa tu email.",
      password: "Ingresa tu contrasena.",
    });
    expect(mockedLogin).not.toHaveBeenCalled();
  });
});
