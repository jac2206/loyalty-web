import { RedeemForm } from "@/features/transaction/components/RedeemForm";
import { FlowAside } from "@/shared/components/FlowAside";

export default function RedeemPage() {
  return (
    <main className="flow-main">
      <div className="flow-layout">
        <RedeemForm />
        <FlowAside icon="star" eyebrow="USA TUS PUNTOS" title="Dales un nuevo destino." description="Utiliza tus puntos acumulados registrando los datos de la operación." steps={["Consulta tu saldo desde el resumen de cuenta.", "Ingresa los códigos, puntos y referencia.", "Revisa la información antes de confirmar."]} />
      </div>
    </main>
  );
}
