"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./Icon";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

const navigation: { href: string; label: string; icon: IconName }[] = [
  { href: "/home", label: "Resumen", icon: "home" },
  { href: "/transactions", label: "Movimientos", icon: "list" },
  { href: "/accumulate", label: "Acumular", icon: "plus" },
  { href: "/redeem", label: "Redimir", icon: "star" },
  { href: "/profile", label: "Mi perfil", icon: "user" },
];

function subscribeTheme(callback: () => void) {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  preference.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener("jac-theme-change", callback);
  return () => {
    preference.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("jac-theme-change", callback);
  };
}

function getTheme(): "light" | "dark" {
  const saved = localStorage.getItem("jac-theme");
  return saved === "dark" || saved === "light" ? saved :
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "light" as const);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const dialog = menuRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches && menuRef.current?.open) menuRef.current.close();
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("jac-theme", next);
    window.dispatchEvent(new Event("jac-theme-change"));
  }

  function keepFocusInMenu(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const themeButton = (
    <button type="button" className="jac-theme" onClick={toggleTheme} aria-label={theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}>
      <Icon name={theme === "light" ? "moon" : "sun"} />{theme === "light" ? "Oscuro" : "Claro"}
    </button>
  );
  const brand = (
    <Link href={isAuth ? "/login" : "/home"} className="jac-brand" aria-label="JAC Lealtad, inicio">
      <Image src="/jac-isotype.png" width={44} height={44} alt="" priority />
      <span><strong>JAC</strong><small>Lealtad</small></span>
    </Link>
  );
  const currentPage = navigation.find(({ href }) => pathname === href || (href === "/profile" && pathname.startsWith("/profile/")))?.label ?? "Mi cuenta";
  const nav = (mobile = false) => (
    <nav className="sidebar-nav" aria-label="Navegación principal">
      <p>Mi cuenta</p>
      {navigation.map(({ href, label, icon }) => (
        <Link key={href} href={href} onClick={mobile ? () => menuRef.current?.close() : undefined} aria-current={pathname === href || (href === "/profile" && pathname.startsWith("/profile/")) ? "page" : undefined}>
          <Icon name={icon} />{label}
        </Link>
      ))}
    </nav>
  );

  if (isAuth) {
    return (
      <div className="jac-shell">
        <a href="#contenido" className="sr-only focus:not-sr-only">Saltar al contenido</a>
        <header className="jac-header"><div className="jac-header-inner">{brand}{themeButton}</div></header>
        <div id="contenido" tabIndex={-1}>{children}</div>
        <footer className="jac-footer">JAC Lealtad</footer>
      </div>
    );
  }

  return (
    <div className="jac-shell jac-app-shell">
      <a href="#contenido" className="sr-only focus:not-sr-only">Saltar al contenido</a>
      <aside className="jac-sidebar" aria-label="Menú de cuenta">
        <div className="sidebar-brand">{brand}</div>
        {nav()}
        <div className="sidebar-bottom"><LogoutButton className="sidebar-logout" /></div>
      </aside>
      <dialog ref={menuRef} id="mobile-menu" className="jac-drawer" aria-labelledby="mobile-menu-title" onKeyDown={keepFocusInMenu} onClose={() => setMenuOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) menuRef.current?.close(); }}>
        <div className="drawer-content">
          <div className="drawer-header"><span id="mobile-menu-title" className="drawer-title">Menú</span><button type="button" className="menu-icon-button" aria-label="Cerrar menú" onClick={() => menuRef.current?.close()}><Icon name="close" /></button></div>
          <div className="sidebar-brand">{brand}</div>
          {nav(true)}
          <div className="sidebar-bottom"><LogoutButton className="sidebar-logout" /></div>
        </div>
      </dialog>
      <div className="jac-app-content">
        <header className="jac-header app-topbar"><div className="app-topbar-inner">
          <button type="button" className="menu-icon-button menu-open" aria-label="Abrir menú" aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => { menuRef.current?.showModal(); setMenuOpen(true); }}><Icon name="menu" /></button>
          <div className="app-mobile-brand">{brand}</div>
          <p className="app-breadcrumb"><span>Mi cuenta</span><span aria-hidden="true">/</span><strong>{currentPage}</strong></p>
          {themeButton}
        </div></header>
        <div id="contenido" tabIndex={-1}>{children}</div>
      </div>
    </div>
  );
}
