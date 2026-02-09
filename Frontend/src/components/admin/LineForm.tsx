import { authFetch } from "../../services/authFetch";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { TrashBinIcon } from "../../icons";
import Alert from "../../components/ui/alert/Alert";
import { API_BASE } from "../../config/api";

//Tipos

interface Line {
  id?: number;
  name: string;
  status: boolean;
}

interface LineFormProps {
  selectedLine: Line | null;
  clearSelection: () => void;
  reload: () => void;
}

export default function LineForm({
  selectedLine,
  clearSelection,
  reload,
}: LineFormProps) {
  const [form, setForm] = useState({
    name: "",
    status: true,
  });

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // Cuando cargan un país → llenar inputs
  useEffect(() => {
    if (selectedLine) {
      setForm(selectedLine);
    }
  }, [selectedLine]);

  /* ===================== Alert auto-hide ===================== */
  useEffect(() => {
    if (!alertData) return;
    const timer = setTimeout(() => setAlertData(null), 4000);
    return () => clearTimeout(timer);
  }, [alertData]);

  const handleChange = (field: keyof Line, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setAlertData({
        variant: "warning",
        title: "Campo obligatorio",
        message: "El nombre de la línea no puede estar vacío.",
      });
      return;
    }

    try {
      if (selectedLine) {
        // UPDATE
        await authFetch(`${API_BASE}/line/${selectedLine.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Actualizado",
          message: "La línea fue actualizada correctamente.",
        });
      } else {
        // CREATE
        await authFetch(`${API_BASE}/line`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Creado",
          message: "La línea fue creada correctamente.",
        });
      }

      setForm({ name: "", status: true });
      clearSelection();
      reload();
    } catch (err) {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "Ocurrió un error al guardar la línea.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedLine) return;

    try {
      await authFetch(`${API_BASE}/line/${selectedLine.id}`, {
        method: "DELETE",
      });

      setAlertData({
        variant: "success",
        title: "Eliminado",
        message: "La línea fue eliminada correctamente.",
      });

      clearSelection();
      reload();
    } catch {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "No se pudo eliminar la línea.",
      });
    }
  };

  const resetForm = () => {
    setForm({ name: "", status: true });
    clearSelection();
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
        {selectedLine ? "Editar Linea" : "Crear Linea"}
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label>Nombre</Label>
          <Input value={form.name} onChange={(v) => handleChange("name", v)} />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button variant="primary" onClick={handleSubmit}>
          {selectedLine ? "Actualizar" : "Añadir"}
        </Button>

        <Button variant="outline" onClick={resetForm}>
          Limpiar
        </Button>

        {selectedLine && (
          <Button variant="outline" onClick={handleDelete}>
            <TrashBinIcon />
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
