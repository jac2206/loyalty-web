import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthLayout } from "@/shared/components/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
