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
interface Line {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    lineId: number;
}

interface ProductFormProps {
    selectedProduct: Product | null;
    clearSelection: () => void;
    reload: () => void;
    lines: Line[];
}

export default function ProductForm({
    selectedProduct,
    clearSelection,
    reload,
    lines,
}: ProductFormProps) {

    const [name, setName] = useState("");
    const [lineId, setLineId] = useState("");

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

    const lineOptions = lines.map((l) => ({
        value: String(l.id),
        label: l.name,
    }));

    useEffect(() => {
        if (selectedProduct) {
            setName(selectedProduct.name);
            setLineId(String(selectedProduct.lineId));
        } else {
            setName("");
            setLineId("");
        }
    }, [selectedProduct]);

    const resetForm = () => {
        setName("");
        setLineId("");
        clearSelection();
    };

    const handleSubmit = async () => {
        if (!name.trim() || !lineId.trim()) {
            setAlertData({
                variant: "warning",
                title: "Campos obligatorios",
                message: "El nombre del producto y la línea son obligatorios.",
            });
            return;
        }

        const payload = {
            name,
            lineId: Number(lineId),
            status: true,
        };

        try {
            if (selectedProduct) {
                await authFetch(`${API_BASE}/category/${selectedProduct.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });

                setAlertData({
                    variant: "success",
                    title: "Actualizado",
                    message: "El producto fue actualizado correctamente.",
                });
            } else {
                await authFetch(`${API_BASE}/category`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                setAlertData({
                    variant: "success",
                    title: "Creado",
                    message: "El producto fue creado correctamente.",
                });
            }

            resetForm();
            reload();
        } catch (err) {
            setAlertData({
                variant: "error",
                title: "Error",
                message: "Ocurrió un error al guardar el producto.",
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            await authFetch(`${API_BASE}/category/${selectedProduct.id}`, {
                method: "DELETE",
            });

            setAlertData({
                variant: "success",
                title: "Eliminado",
                message: "El producto fue eliminado correctamente.",
            });

            clearSelection();
            resetForm();
            reload();
        } catch {
            setAlertData({
                variant: "error",
                title: "Error",
                message: "No se pudo eliminar el producto.",
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
                {selectedProduct ? "Editar producto" : "Crear producto"}
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                    <Label>Nombre</Label>
                    <Input value={name} onChange={setName} />
                </div>

                <div>
                    <Label>Línea</Label>
                    <Select
                        options={lineOptions}
                        value={lineId}
                        onChange={(v) => setLineId(String(v))}
                        placeholder="Seleccionar línea"
                    />
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <Button variant="primary" onClick={handleSubmit}>
                    {selectedProduct ? "Actualizar" : "Añadir"}
                </Button>

                <Button variant="outline" onClick={resetForm}>
                    Limpiar
                </Button>

                {selectedProduct && (
                    <Button variant="outline" onClick={handleDelete}>
                        <TrashBinIcon />
                        Eliminar
                    </Button>
                )}
            </div>
        </div>
    );
}
