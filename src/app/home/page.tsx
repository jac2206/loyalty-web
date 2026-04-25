import { BalanceCard } from "@/features/account/components/BalanceCard";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { TransactionActions } from "@/features/transaction/components/TransactionActions";
import { ProfileCard } from "@/features/user/components/ProfileCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f9fafb_55%)] px-6 py-10">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Resumen de cuenta
          </h1>
          <p className="text-sm text-gray-600">
            Consulta tu saldo actual de puntos desde la cuenta autenticada.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          <BalanceCard />
          <div className="space-y-2">
            <ProfileCard />
            <TransactionActions />
          </div>
        </div>

        <div className="flex justify-center border-t border-gray-200 pt-6">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
