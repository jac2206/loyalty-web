import { TransactionList } from "@/features/transaction/components/TransactionList";

export default function TransactionsPage() {
  return (
    <main className="flow-main">
      <section className="history-layout">
        <TransactionList />
      </section>
    </main>
  );
}
