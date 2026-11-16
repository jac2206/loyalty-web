import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userService } from "../services/userService";
import { UpdateUserForm } from "./UpdateUserForm";

vi.mock("../services/userService", () => ({
  userService: { getMe: vi.fn(), updateUser: vi.fn() },
}));

const getMe = vi.mocked(userService.getMe);
const updateUser = vi.mocked(userService.updateUser);
const user = { id: "1", documentNumber: "123456", fullName: "Ana", email: "ana@example.com" };

describe("UpdateUserForm", () => {
  beforeEach(() => vi.resetAllMocks());

  it("recovers from a loading error before enabling editing", async () => {
    getMe.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(user);
    render(<UpdateUserForm />);
    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar tu perfil.");
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
    expect(screen.queryByLabelText("Nombre completo")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeEnabled();
  });

  it("associates validation errors with fields and does not send invalid data", async () => {
    getMe.mockResolvedValueOnce(user);
    render(<UpdateUserForm />);
    const name = await screen.findByLabelText("Nombre completo");
    const email = screen.getByLabelText("Correo electrónico");
    fireEvent.change(name, { target: { value: " " } });
    fireEvent.change(email, { target: { value: "incorrecto" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Ingresa tu nombre completo.");
    expect(email).toHaveAccessibleDescription("Ingresa un correo electrónico válido.");
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("saves valid changes and reports success", async () => {
    getMe.mockResolvedValueOnce(user);
    updateUser.mockResolvedValueOnce({ ...user, fullName: "Ana López" });
    render(<UpdateUserForm />);
    fireEvent.change(await screen.findByLabelText("Nombre completo"), { target: { value: " Ana López " } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(updateUser).toHaveBeenCalledWith("123456", { fullName: "Ana López", email: user.email }));
    expect(await screen.findByRole("status")).toHaveTextContent("Tus datos se actualizaron correctamente.");
  });

  it("keeps entered values and reports a save failure", async () => {
    getMe.mockResolvedValueOnce(user);
    updateUser.mockRejectedValueOnce(new Error("offline"));
    render(<UpdateUserForm />);
    fireEvent.change(await screen.findByLabelText("Nombre completo"), { target: { value: "Ana López" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos actualizar tus datos.");
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("Ana López");
  });
});
