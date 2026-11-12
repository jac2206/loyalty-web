import { UpdateUserForm } from "@/features/user/components/UpdateUserForm";
import { FlowAside } from "@/shared/components/FlowAside";

export default function EditProfilePage() {
  return (
    <main className="flow-main">
      <div className="flow-layout profile-layout">
        <UpdateUserForm />
        <FlowAside icon="user" eyebrow="TU INFORMACIÓN" title="Mantén tu perfil al día." description="Actualiza los datos con los que identificamos tu cuenta." steps={["Revisa tu nombre completo y correo electrónico.", "Guarda los cambios para actualizar tu perfil."]} />
      </div>
    </main>
  );
}
