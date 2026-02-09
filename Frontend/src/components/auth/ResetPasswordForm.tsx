import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { API_BASE } from "../../config/api";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/auth/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al restablecer la contraseña");
        return;
      }
      setSuccess("Contraseña restablecida correctamente");

      setTimeout(() => {
        navigate("/signin");
      }, 1500);

      setEmail("");
      setPassword("");
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto gap-4">
        <div className="grid gap-2">
          <strong className="mb-2 font-semibold text-title-lg lg:text-4xl text-gray-900 dark:text-gray-200">
            ¿Olvidaste tu contraseña?
          </strong>

          <p className="mb-6 text-sm text-gray-500">
            Ingresa tu correo y define una nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <Label>Correo *</Label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={setEmail}
            />
          </div>

          {/* NUEVA CONTRASEÑA */}
          <div>
            <Label>Nueva contraseña *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={setPassword}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-gray-500" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500" />
                )}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-error-500">{error}</p>
          )}

          {success && (
            <p className="text-sm font-medium text-success-500">{success}</p>
          )}

          <Button
            className="w-full py-3 text-lg bg-brand-500 text-white rounded-lg disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          ¿Ya recordaste tu contraseña?{" "}
          <Link to="/signin" className="text-brand-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
