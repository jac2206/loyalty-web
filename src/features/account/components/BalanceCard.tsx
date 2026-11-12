"use client";

import Link from "next/link";
import { Icon } from "@/shared/components/Icon";
import { useBalance } from "../hooks/useBalance";

function formatBalance(balance: number): string {
  return new Intl.NumberFormat("es-CO").format(balance);
}

export function BalanceCard() {
  const { balance, isLoading, error, reloadBalance } = useBalance();
  const balanceLabel = balance === null ? "" : formatBalance(balance);

  return (
    <section className="points-card" aria-labelledby="balance-title" aria-busy={isLoading}>
      <div className="points-card-grid" aria-hidden="true" />
      <div className="points-card-top">
        <span className="points-label"><Icon name="star" /> Tu cuenta de puntos</span>
        <button className="points-refresh" type="button" onClick={() => void reloadBalance()} disabled={isLoading} aria-label="Actualizar saldo">
          <Icon name="refresh" className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="points-card-body" aria-live="polite">
        <h2 id="balance-title" className="points-caption">Saldo disponible</h2>
        {isLoading ? (
          <div className="points-loading" role="status">
            <div className="points-skeleton animate-pulse" aria-hidden="true" />
            <p>Cargando saldo...</p>
          </div>
        ) : null}
        {!isLoading && error ? (
          <div className="points-feedback" role="alert">
            <p>{error}</p>
            <button type="button" className="points-secondary" onClick={() => void reloadBalance()}>Reintentar</button>
          </div>
        ) : null}
        {!isLoading && !error && balance !== null ? (
          <>
            <p className={`points-value${balanceLabel.length > 12 ? " points-value-long" : ""}`}><span>{balanceLabel}</span><span className="points-unit">pts</span></p>
            <p className="points-description">
              {balance === 0 ? "Tu próxima compra puede ser el comienzo. Empieza a acumular puntos." : "Cada punto cuenta. Consulta y gestiona lo que has acumulado."}
            </p>
          </>
        ) : null}
        {!isLoading && !error && balance === null ? (
          <p className="points-description points-empty">Aún no hay saldo disponible para mostrar.</p>
        ) : null}
      </div>
      <div className="points-card-footer">
        <Link href="/redeem" className="points-cta">Redimir puntos <Icon name="arrow" /></Link>
        <Link href="/transactions" className="points-history">Ver movimientos <Icon name="arrow" /></Link>
      </div>
    </section>
  );
}
