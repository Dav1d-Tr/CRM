import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { TrashBinIcon } from "../../icons";
import Alert from "../../components/ui/alert/Alert";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

// Tipos

interface City {
    id: number;
    name: string;
    countryId: number;
}

interface Country {
    id: number;
    name: string;
}

interface CityFormProps {
    selectedCity: City | null;
    clearSelection: () => void;
    reload: (filter?: string) => void;
    countries: Country[];
}

export default function CityForm({
    selectedCity,
    clearSelection,
    reload,
    countries,
}: CityFormProps) {
    const [name, setName] = useState("");
    const [countryId, setCountryId] = useState("");

    const [alertData, setAlertData] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    useEffect(() => {
        if (!alertData) return;
        const timer = setTimeout(() => setAlertData(null), 4000);
        return () => clearTimeout(timer);
    }, [alertData]);

    const countryOptions = countries.map((c) => ({
        value: String(c.id),
        label: c.name,
    }));

    useEffect(() => {
        if (selectedCity) {
            setName(selectedCity.name);
            setCountryId(String(selectedCity.countryId));
        } else {
            setName("");
            setCountryId("");
        }
    }, [selectedCity]);

    const handleSubmit = async () => {
        if (!name.trim() || !countryId.trim()) {
            setAlertData({
                variant: "warning",
                title: "Campos obligatorios",
                message: "El nombre de la ciudad y el país son obligatorios.",
            });
            return;
        }

        const payload = {
            name,
            countryId: Number(countryId),
            status: true,
        };

        try {
            if (selectedCity) {
                await authFetch(`${API_BASE}/city/${selectedCity.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });

                setAlertData({
                    variant: "success",
                    title: "Actualizada",
                    message: "La ciudad fue actualizada correctamente.",
                });
            } else {
                await authFetch(`${API_BASE}/city`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                setAlertData({
                    variant: "success",
                    title: "Creada",
                    message: "La ciudad fue creada correctamente.",
                });
            }

            setName("");
            setCountryId("");
            clearSelection();
            reload();
        } catch (err) {
            setAlertData({
                variant: "error",
                title: "Error",
                message: "Ocurrió un error al guardar la ciudad.",
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedCity) return;

        try {
            await authFetch(`${API_BASE}/city/${selectedCity.id}`, {
                method: "DELETE",
            });

            setAlertData({
                variant: "success",
                title: "Eliminada",
                message: "La ciudad fue eliminada correctamente.",
            });

            clearSelection();
            reload();
        } catch {
            setAlertData({
                variant: "error",
                title: "Error",
                message: "No se pudo eliminar la ciudad.",
            });
        }
    };

    const resetForm = () => {
        setName("");
        setCountryId("");
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
                {selectedCity ? "Editar ciudad" : "Crear ciudad"}
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                    <Label>Nombre</Label>
                    <Input value={name} onChange={setName} />
                </div>

                <div>
                    <Label>País</Label>
                    <Select
                        options={countryOptions}
                        value={countryId}
                        onChange={(v) => setCountryId(String(v))}
                        placeholder="Seleccionar país"
                    />

                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <Button variant="primary" onClick={handleSubmit}>
                    {selectedCity ? "Actualizar" : "Añadir"}
                </Button>

                <Button variant="outline" onClick={() => reload(name)}>
                    Buscar
                </Button>

                <Button variant="outline" onClick={resetForm}>
                    Limpiar
                </Button>

                {selectedCity && (
                    <Button variant="outline" onClick={handleDelete}>
                        <TrashBinIcon />
                        Eliminar
                    </Button>
                )}
            </div>
        </div>
    );
}
