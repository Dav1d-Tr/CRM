import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { TrashBinIcon } from "../../icons";
import Alert from "../../components/ui/alert/Alert";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

// Tipos

interface Country {
  id: number;
  name: string;
  flag: string;
  lat: string;
  lng: string;
  prefix: string;
  status: boolean;
}

interface CountryFormProps {
  selectedCountry: Country | null;
  clearSelection: () => void;
  reload: () => Promise<void>;
}

export default function CountryForm({ selectedCountry, clearSelection, reload }: CountryFormProps) {
  const [form, setForm] = useState({
    name: "",
    flag: "",
    lat: "",
    lng: "",
    prefix: "",
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

  useEffect(() => {
    if (selectedCountry) {
      setForm({
        name: selectedCountry.name,
        flag: selectedCountry.flag,
        lat: selectedCountry.lat,
        lng: selectedCountry.lng,
        prefix: selectedCountry.prefix,
        status: selectedCountry.status,
      });
    } else {
      setForm({ name: "", flag: "", lat: "", lng: "", prefix: "", status: true });
    }
  }, [selectedCountry]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.flag.trim() ||
      !form.lat.trim() ||
      !form.lng.trim()
    ) {
      setAlertData({
        variant: "warning",
        title: "Campos obligatorios",
        message: "Todos los campos deben estar completos antes de guardar.",
      });
      return;
    }

    try {
      if (selectedCountry) {
        // UPDATE
        await authFetch(`${API_BASE}/country/${selectedCountry.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Actualizado",
          message: "El país fue actualizado correctamente.",
        });
      } else {
        // CREATE
        await authFetch(`${API_BASE}/country`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        setAlertData({
          variant: "success",
          title: "Creado",
          message: "El país fue creado correctamente.",
        });
      }

      setForm({ name: "", flag: "", lat: "", lng: "", prefix: "", status: true });
      clearSelection();
      reload();
    } catch (err) {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "Ocurrió un error al guardar el país.",
      });
    }
  };


  const handleDelete = async () => {
    if (!selectedCountry) return;

    try {
      await authFetch(`${API_BASE}/country/${selectedCountry.id}`, {
        method: "DELETE",
      });

      setAlertData({
        variant: "success",
        title: "Eliminado",
        message: "El país fue eliminado correctamente.",
      });

      clearSelection();
      reload();
    } catch {
      setAlertData({
        variant: "error",
        title: "Error",
        message: "No se pudo eliminar el país.",
      });
    }
  };

  const resetForm = () => {
    setForm({ name: "", flag: "", lat: "", lng: "", prefix: "", status: true });
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
        {selectedCountry ? "Editar país" : "Crear país"}
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label>Nombre</Label>
          <Input value={form.name} onChange={(v) => handleChange("name", v)} />
        </div>

        <div>
          <Label>Bandera</Label>
          <Input value={form.flag} onChange={(v) => handleChange("flag", v)} />
        </div>

        <div>
          <Label>Prefijo</Label>

          <div className="relative">
            <span className="absolute left-0 top-0 h-full flex items-center px-4 text-amber-50 bg-[#b22948] rounded-l-md select-none z-10">
              +
            </span>

            <Input
              className="pl-14"
              value={form.prefix}
              onChange={(v) => handleChange("prefix", v)}
            />
          </div>
        </div>

        <div>
          <Label>Latitud</Label>
          <Input value={form.lat} onChange={(v) => handleChange("lat", v)} />
        </div>

        <div>
          <Label>Longitud</Label>
          <Input value={form.lng} onChange={(v) => handleChange("lng", v)} />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button variant="primary" onClick={handleSubmit}>
          {selectedCountry ? "Actualizar" : "Añadir"}
        </Button>

        <Button variant="outline" onClick={resetForm}>
          Limpiar
        </Button>

        {selectedCountry && (
          <Button variant="outline" onClick={handleDelete}>
            <TrashBinIcon />
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
