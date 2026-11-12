import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUser } from "../hooks/useUser";
import { ProfileCard } from "./ProfileCard";

vi.mock("../hooks/useUser", () => ({ useUser: vi.fn() }));

describe("ProfileCard", () => {
  it("shows the profile data and edit link", () => {
    vi.mocked(useUser).mockReturnValue({ user: { fullName: "Ana Pérez", email: "ana@example.com", documentType: "CC", documentNumber: "123" }, isLoading: false, error: null, reloadUser: vi.fn() });
    render(<ProfileCard />);

    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeInTheDocument();
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Actualizar nombre y correo" })).toHaveAttribute("href", "/profile/edit");
  });

  it("announces a loading error and allows retrying", () => {
    const reloadUser = vi.fn();
    vi.mocked(useUser).mockReturnValue({ user: null, isLoading: false, error: "No pudimos cargar tu perfil.", reloadUser });
    render(<ProfileCard />);

    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos cargar tu perfil.");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(reloadUser).toHaveBeenCalledOnce();
  });
});
