import { AccumulateForm } from "@/features/transaction/components/AccumulateForm";
import { FlowAside } from "@/shared/components/FlowAside";

export default function AccumulatePage() {
  return (
    <main className="flow-main">
      <div className="flow-layout">
        <AccumulateForm />
        <FlowAside icon="plus" eyebrow="SUMA A TU CUENTA" title="Cada compra cuenta." description="Registra los datos de tu compra para acumular puntos en tu cuenta." steps={["Ten a mano los códigos del aliado y la sede.", "Ingresa el valor y la referencia de tu compra.", "Revisa la información antes de confirmar."]} />
      </div>
    </main>
  );
}
