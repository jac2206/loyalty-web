import { RedeemForm } from "@/features/transaction/components/RedeemForm";

export default function RedeemPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto flex max-w-5xl justify-center">
        <RedeemForm />
      </section>
    </main>
  );
}
