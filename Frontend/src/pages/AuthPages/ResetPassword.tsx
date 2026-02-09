import { Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function SignIn() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // 🔒 Si ya está logueado, no vuelve al login
  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageMeta
        title="¿Olvidaste tu contraseña? | CRM"
        description="Página de inicio de sesión"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
