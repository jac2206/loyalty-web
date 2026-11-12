import Image from "next/image";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-main">
      <div className="auth-layout">
        <aside className="auth-intro" aria-label="JAC Lealtad">
          <div className="auth-intro-grid" aria-hidden="true" />
          <div className="auth-intro-top"><span className="auth-intro-tag">JAC · LEALTAD</span><Image src="/jac-isotype.png" alt="" width={68} height={68} /></div>
          <div className="auth-intro-copy">
            <p className="auth-intro-eyebrow">TU CUENTA DE PUNTOS</p>
            <h2>Que cada punto<br /><span>cuente.</span></h2>
            <p>Tu saldo, tus movimientos y tus próximas oportunidades, en un solo lugar.</p>
          </div>
          <div className="auth-intro-footer"><span>01 / TU ESPACIO</span><span>HECHO PARA TI</span></div>
        </aside>
        <div className="auth-form-wrap">{children}</div>
      </div>
    </main>
  );
}
