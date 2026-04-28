import type { FormEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "./LoginForm";

vi.mock("../hooks/useLogin", () => ({
  useLogin: vi.fn(),
}));

const mockedUseLogin = vi.mocked(useLogin);

function mockUseLogin(overrides: Partial<ReturnType<typeof useLogin>> = {}) {
  const defaultReturn: ReturnType<typeof useLogin> = {
    values: {
      email: "",
      password: "",
    },
    fieldErrors: {},
    isLoading: false,
    error: null,
    updateField: vi.fn(),
    handleSubmit: vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    }),
  };

  mockedUseLogin.mockReturnValue({
    ...defaultReturn,
    ...overrides,
  });

  return {
    ...defaultReturn,
    ...overrides,
  };
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login fields and register link", () => {
    mockUseLogin();

    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Iniciar sesion" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contrasena")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ingresar" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Registrate" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("calls updateField when the user changes the email and password", () => {
    const updateField = vi.fn();
    mockUseLogin({ updateField });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Contrasena"), {
      target: { value: "secret123" },
    });

    expect(updateField).toHaveBeenCalledWith("email", "ana@example.com");
    expect(updateField).toHaveBeenCalledWith("password", "secret123");
  });

  it("submits the form through the hook handler", () => {
    const handleSubmit = vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    mockUseLogin({ handleSubmit });

    render(<LoginForm />);

    fireEvent.submit(screen.getByRole("button", { name: "Ingresar" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders field and api errors", () => {
    mockUseLogin({
      error: "Credenciales invalidas",
      fieldErrors: {
        email: "Ingresa un email valido.",
        password: "Ingresa tu contrasena.",
      },
    });

    render(<LoginForm />);

    expect(screen.getByText("Credenciales invalidas")).toBeInTheDocument();
    expect(screen.getByText("Ingresa un email valido.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu contrasena.")).toBeInTheDocument();
  });

  it("disables fields and shows loading text while submitting", () => {
    mockUseLogin({ isLoading: true });

    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Contrasena")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Ingresando..." }),
    ).toBeDisabled();
  });
});
