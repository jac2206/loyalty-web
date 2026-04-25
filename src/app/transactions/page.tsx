import { TransactionList } from "@/features/transaction/components/TransactionList";

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto flex max-w-5xl justify-center">
        <TransactionList />
      </section>
    </main>
  );
}
