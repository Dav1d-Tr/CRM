import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { API_BASE } from "../../config/api";

interface Option {
  value: string;
  label: string;
}

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<Option[]>([]);
  const [documentTypes, setDocumentTypes] = useState<Option[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    numberPhone: "",
    avatar: null,
    roleId: "",
    documentId: "",
  });

  /* ===================== HANDLERS ===================== */
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ===================== LOAD ROLES ===================== */
  useEffect(() => {
    fetch(`${API_BASE}/userRole`)
      .then((res) => res.json())
      .then((data) =>
        setRoles(
          data.map((r: any) => ({
            value: String(r.id),
            label: r.name,
          }))
        )
      )
      .catch(() => setError("Error cargando roles"));
  }, []);

  /* ===================== LOAD DOCUMENT TYPES ===================== */
  useEffect(() => {
    fetch(`${API_BASE}/typeDocument`)
      .then((res) => res.json())
      .then((data) =>
        setDocumentTypes(
          data.map((d: any) => ({
            value: String(d.id),
            label: d.name,
          }))
        )
      )
      .catch(() => setError("Error cargando tipos de documento"));
  }, []);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const required = [
      "id",
      "name",
      "lastName",
      "email",
      "password",
      "numberPhone",
      "roleId",
      "documentId",
    ];

    for (const field of required) {
      if (!(form as any)[field]) {
        setError("Todos los campos obligatorios deben estar completos");
        return;
      }
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          roleId: Number(form.roleId),
          documentId: Number(form.documentId),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full lg:w-1/2 h-auto overflow-hidden">
      <div className="flex flex-col justify-center max-sm:items-center lg:flex-1 w-full max-w-md mx-auto gap-4">
        <strong className="mb-2 font-semibold lg:text-title-md text-3xl text-gray-900 dark:text-gray-200">
          Registrarte
        </strong>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                value={form.name}
                onChange={(v) => handleChange("name", v)}
              />
            </div>
            <div>
              <Label>Apellido *</Label>
              <Input
                value={form.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>N° Documento *</Label>
              <Input
                type="number"
                value={form.id}
                onChange={(v) => handleChange("id", v)}
              />
            </div>

            <div>
              <Label>Tipo Documento *</Label>
              <Select
                options={documentTypes}
                value={form.documentId}
                onChange={(v) => handleChange("documentId", v)}
                placeholder="Seleccionar tipo"
              />
            </div>
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contraseña *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text " : "password"}
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-200 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            <div>
              <Label>Teléfono *</Label>
              <Input
                type="number"
                value={form.numberPhone}
                onChange={(v) => handleChange("numberPhone", v)}
              />
            </div>
          </div>

          <div>
            <Label>Rol *</Label>
            <Select
              options={roles}
              value={form.roleId}
              onChange={(v) => handleChange("roleId", v)}
              placeholder="Seleccionar rol"
            />
          </div>

          {error && <p className="text-error-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-3 text-lg bg-brand-500 text-white rounded-lg disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/signin" className="text-brand-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
