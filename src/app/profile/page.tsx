import { ProfileCard } from "@/features/user/components/ProfileCard";
import { FlowAside } from "@/shared/components/FlowAside";

export default function ProfilePage() {
  return (
    <main className="flow-main">
      <div className="flow-layout profile-layout">
        <ProfileCard />
        <FlowAside icon="user" eyebrow="TU INFORMACIÓN" title="Tu cuenta, a tu manera." description="Consulta los datos asociados a tu cuenta de lealtad en un solo lugar." steps={["Revisa tu nombre y correo electrónico.", "Actualiza tu información cuando lo necesites.", "Consulta los datos de tu documento."]} />
      </div>
    </main>
  );
}
