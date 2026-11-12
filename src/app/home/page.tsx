import { BalanceCard } from "@/features/account/components/BalanceCard";
import { TransactionActions } from "@/features/transaction/components/TransactionActions";
import { ProfileCard } from "@/features/user/components/ProfileCard";

export default function HomePage() {
  return (
    <main className="dashboard-main">
      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">Mi espacio · JAC Lealtad</p>
            <h1>Tus puntos. Tus posibilidades.</h1>
            <p>Consulta lo que has acumulado y elige tu próxima operación.</p>
          </div>
          <span className="dashboard-account-tag">Resumen de cuenta</span>
        </div>
        <div className="dashboard-overview">
          <BalanceCard />
          <ProfileCard compact />
        </div>
        <TransactionActions />
      </section>
    </main>
  );
}
