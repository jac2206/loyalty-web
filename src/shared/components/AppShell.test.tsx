import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/profile",
  useRouter: () => ({ push }),
}));

describe("AppShell", () => {
  beforeEach(() => {
    push.mockReset();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value() { this.setAttribute("open", ""); },
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value() { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); },
    });
  });

  it("opens and closes the mobile menu with the correct expanded state", () => {
    render(<AppShell><main>Contenido</main></AppShell>);

    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Menú" })).toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("clears the session and returns to login when signing out", () => {
    sessionStorage.setItem("token", "test-token");
    render(<AppShell><main>Contenido</main></AppShell>);

    const sidebar = screen.getByRole("complementary", { name: "Menú de cuenta" });
    fireEvent.click(within(sidebar).getByRole("button", { name: "Cerrar sesión" }));
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("keeps Tab navigation inside the open mobile menu", () => {
    render(<AppShell><main>Contenido</main></AppShell>);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
    const dialog = screen.getByRole("dialog", { name: "Menú" });
    const close = within(dialog).getByRole("button", { name: "Cerrar menú" });
    const logout = within(dialog).getByRole("button", { name: "Cerrar sesión" });

    logout.focus();
    fireEvent.keyDown(logout, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(logout).toHaveFocus();
  });
});
