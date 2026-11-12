import Link from "next/link";
import { Icon, type IconName } from "@/shared/components/Icon";

const actions: { href: string; label: string; description: string; icon: IconName }[] = [
  { href: "/accumulate", label: "Acumular", description: "Registra una compra y suma puntos a tu cuenta.", icon: "plus" },
  { href: "/redeem", label: "Redimir", description: "Utiliza los puntos que has acumulado.", icon: "star" },
  { href: "/transactions", label: "Ver historial", description: "Encuentra el detalle de tus movimientos.", icon: "list" },
];

export function TransactionActions() {
  return (
    <section className="quick-actions" aria-labelledby="actions-title">
      <div className="dashboard-section-heading">
        <div>
          <p className="dashboard-eyebrow">A tu alcance</p>
          <h2 id="actions-title">¿Qué quieres hacer hoy?</h2>
        </div>
      </div>
      <div className="action-grid">
        {actions.map(({ href, label, description, icon }) => (
          <Link key={href} href={href} className="action-tile" aria-label={label}>
            <span className="action-icon"><Icon name={icon} /></span>
            <span className="action-copy"><strong>{label}</strong><span>{description}</span></span>
            <Icon name="arrow" className="action-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
