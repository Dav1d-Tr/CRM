import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { TrashBinIcon } from "../../icons";
import Alert from "../../components/ui/alert/Alert";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

// Tipos
interface UserRole {
  id: number;
  name: string;
  status: boolean;
}

interface RoleFormProps {
  selectedUserRole: UserRole | null;
  clearSelection: () => void;
  reload: () => Promise<void>;
}

export default function RoleForm({
  selectedUserRole,
  clearSelection,
  reload,
}: RoleFormProps) {
  const [form, setForm] = useState({
    name: "",
    status: true,
  });

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  /* ===================== Alert auto-hide ===================== */
  useEffect(() => {
    if (!alertData) return;
    const timer = setTimeout(() => setAlertData(null), 4000);
    return () => clearTimeout(timer);
  }, [alertData]);

  // Cuando seleccionan un rol → llenar inputs
  useEffect(() => {
    if (selectedUserRole) {
      setForm(selectedUserRole);
    }
  }, [selectedUserRole]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", status: true });
    clearSelection();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setAlertData({
        variant: "warning",
        title: "Campo obligatorio",
        message: "El nombre del rol no puede estar vacío.",
      });
      return;
    }

    try {
      if (selectedUserRole) {
        // UPDATE
        await authFetch(`${API_BASE}/userRole/${selectedUserRole.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Actualizado",
          message: "El rol fue actualizado correctamente.",
        });
      } else {
        // CREATE
        await authFetch(`${API_BASE}/userRole`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Creado",
          message: "El rol fue creado correctamente.",
        });
      }

      resetForm();
      await reload();
    } catch (error) {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "Ocurrió un error al guardar el rol.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedUserRole) return;

    try {
      await authFetch(`${API_BASE}/userRole/${selectedUserRole.id}`, {
        method: "DELETE",
      });

      setAlertData({
        variant: "success",
        title: "Eliminado",
        message: "El rol fue eliminado correctamente.",
      });

      resetForm();
      await reload();
    } catch (error) {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "No se pudo eliminar el rol.",
      });
    }
  };

  return (
    <div className="p-5 border border-gray-500 rounded-2xl grid gap-6">
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
          showLink={false}
        />
      )}

      <h4 className="text-3xl font-semibold text-gray-900 dark:text-gray-200">
        {selectedUserRole ? "Editar Rol de Usuario" : "Crear Rol de Usuario"}
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label>Nombre</Label>
          <Input value={form.name} onChange={(v) => handleChange("name", v)} />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button variant="primary" onClick={handleSubmit}>
          {selectedUserRole ? "Actualizar" : "Añadir"}
        </Button>

        <Button variant="outline" onClick={resetForm}>
          Limpiar
        </Button>

        {selectedUserRole && (
          <Button variant="outline" onClick={handleDelete}>
            <TrashBinIcon />
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
