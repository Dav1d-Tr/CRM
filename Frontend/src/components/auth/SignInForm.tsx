import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { API_BASE } from "../../config/api";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciales inválidas");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
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
          <strong className="mb-2 font-semibold lg:text-title-lg text-3xl text-gray-900 dark:text-gray-200">
            Iniciar sesión
          </strong>

          <p className="mb-6 text-sm text-gray-500">
            Ingresa tu correo y contraseña
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

          {/* PASSWORD */}
          <div>
            <Label>Contraseña *</Label>
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

          <div className="flex items-center justify-between">
            <Link
              to="/resetpassword"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>

          {error && (
            <p className="text-sm font-medium text-error-500">{error}</p>
          )}

          <Button
            className="w-full py-3 text-lg bg-brand-500 text-white rounded-lg disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="text-brand-500 hover:text-brand-600">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
