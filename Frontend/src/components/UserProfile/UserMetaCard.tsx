
// src/components/UserProfile/UserMetaCard.tsx
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { PencilIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface Role {
  id: number;
  name: string;
}

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    numberPhone: "",
    roleId: "",
    documentId: "",
    password: ""
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    setForm({
      name: parsed.name,
      lastName: parsed.lastName,
      email: parsed.email,
      numberPhone: parsed.numberPhone,
      roleId: String(parsed.roleId),
      documentId: String(parsed.documentId),
      password: ""
    });

  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await authFetch(`${API_BASE}/userRole`);
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando roles", err);
      }
    };

    fetchRoles();
  }, []);

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    `${user?.name || ""} ${user?.lastName || ""}`
  )}`;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");

    const payload: any = {
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      numberPhone: form.numberPhone,
      roleId: Number(form.roleId),
      documentId: Number(form.documentId),
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      const updatedUser = await authFetch(`${API_BASE}/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!updatedUser) {
        setError("No se pudo actualizar el usuario");
        return;
      }

      const mergedUser = {
        ...user,
        ...updatedUser,
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);

      window.dispatchEvent(new Event("user-updated"));

      closeModal();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión con el servidor");
    }
  };

  const roleName = roles.find(r => r.id === user?.roleId)?.name || "Sin rol";

  if (!user) return null;

  return (
    <>
      {/* CARD */}
      <div className="p-5 border border-gray-500 rounded-2xl lg:p-6">
        <div className="flex flex-col gap-5 items-center xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border rounded-full bg-white">
              <img src={avatarUrl} alt="user" />
            </div>

            <div>
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {user.name} {user.lastName}
              </h4>
              <p className="text-lg text-gray-500">{roleName}</p>
            </div>
          </div>

          <button
            className="w-fit flex gap-1 items-center px-6 py-2 border-2 rounded-3xl bg-white border-gray-500 z-1 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            onClick={openModal}
          >
            <PencilIcon className="text-[20px]" />
            Editar
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <form className="p-6 space-y-4 grid gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label>Nombre</Label>
              <Input
                value={form.name}
                onChange={(v) => handleChange("name", v)}
              />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input
                value={form.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(v) => handleChange("email", v)}
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                value={form.numberPhone}
                onChange={(v) => handleChange("numberPhone", v)}
              />
            </div>
            <div>
              <Label>Rol</Label>

              <Select
                options={roles.map((r) => ({
                  value: String(r.id),
                  label: r.name,
                }))}
                value={form.roleId}
                onChange={(v) => handleChange("roleId", v)}
              />
            </div>
            <div>
              <Label>Contraseña *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
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
          </div>

          {error && <p className="text-error-500">{error}</p>}

          <div className="flex gap-3">
            <Button onClick={closeModal} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
