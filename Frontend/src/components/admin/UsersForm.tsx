//Corregir, para solo actualizar y eliminar, a la parte de eliminar la tienes que revisar, ya que no me esta permitiendo 
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import Alert from "../../components/ui/alert/Alert";
import { TrashBinIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface Role {
    id: number;
    name: string;
}

interface DocumentType {
    id: number;
    name: string;
}

interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    numberPhone: string;
    roleId: number;
    documentId: number;
}

interface UsersFormProps {
    selectedUser: User | null;
    clearSelection: () => void;
    reload: () => void;
    roles: Role[];
    documents: DocumentType[];
}

export default function UsersForm({
    selectedUser,
    clearSelection,
    reload,
    roles,
    documents,
}: UsersFormProps) {

    const [showPassword, setShowPassword] = useState(false);

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

    const setField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const roleOptions = roles.map((r) => ({
        value: String(r.id),
        label: r.name,
    }));

    const documentOptions = documents.map((d) => ({
        value: String(d.id),
        label: d.name,
    }));

    useEffect(() => {
        if (selectedUser) {
            setForm({
                id: selectedUser.id,
                name: selectedUser.name,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                password: "",
                avatar: null,
                numberPhone: selectedUser.numberPhone,
                roleId: String(selectedUser.roleId),
                documentId: String(selectedUser.documentId),
            });
        }
    }, [selectedUser]);

    const handleSubmit = async () => {
        try {
            await authFetch(`${API_BASE}/user/${form.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: form.name,
                    lastName: form.lastName,
                    email: form.email,
                    numberPhone: form.numberPhone,
                    roleId: Number(form.roleId),
                    documentId: Number(form.documentId),
                }),
            });

            if (form.password.trim()) {
                await authFetch(`${API_BASE}/user/auth/reset-password`, {
                    method: "PUT",
                    body: JSON.stringify({
                        email: form.email,
                        newPassword: form.password,
                    }),
                });
            }
            setAlertData({
                variant: "success",
                title: "Actualizado",
                message: "Usuario actualizado correctamente.",
            });

            setForm(emptyForm);
            clearSelection();
            reload();
        } catch (err) {
            console.error(err);
            setAlertData({
                variant: "error",
                title: "Error",
                message: "No se pudo actualizar el usuario.",
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            await authFetch(`${API_BASE}/user/${selectedUser.id}`, {
                method: "DELETE",
            });

            setAlertData({
                variant: "success",
                title: "Eliminado",
                message: "Usuario eliminado correctamente.",
            });

            clearSelection();
            reload();
        } catch (err) {
            console.error(err);
            setAlertData({
                variant: "error",
                title: "Error",
                message: "No se pudo eliminar el usuario.",
            });
        }
    };

    const emptyForm = {
        id: "",
        name: "",
        lastName: "",
        email: "",
        password: "",
        avatar: null,
        numberPhone: "",
        roleId: "",
        documentId: "",
    };

    const handleClear = () => {
        setForm(emptyForm);
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
                Editar Usuario
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div>
                    <Label>Documento</Label>
                    <Input value={form.id} onChange={(v) => setField("id", v)} />
                </div>

                <div>
                    <Label>Tipo de Documento</Label>
                    <Select
                        options={documentOptions}
                        value={form.documentId}
                        onChange={(v) => setField("documentId", String(v))}
                        placeholder="Seleccionar"
                    />
                </div>

                <div>
                    <Label>Nombre</Label>
                    <Input value={form.name} onChange={(v) => setField("name", v)} />
                </div>

                <div>
                    <Label>Apellido</Label>
                    <Input
                        value={form.lastName}
                        onChange={(v) => setField("lastName", v)}
                    />
                </div>

                <div>
                    <Label>Correo</Label>
                    <Input value={form.email} onChange={(v) => setField("email", v)} />
                </div>

                <div>
                    <Label>
                        Contraseña {selectedUser && "(solo si desea cambiarla)"}
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            value={form.password}
                            onChange={(v) => setField("password", v)}
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

                <div>
                    <Label>Numero de Celular</Label>
                    <Input
                        value={form.numberPhone}
                        onChange={(v) => setField("numberPhone", v)}
                    />
                </div>

                <div>
                    <Label>Rol</Label>
                    <Select
                        options={roleOptions}
                        value={form.roleId}
                        onChange={(v) => setField("roleId", String(v))}
                        placeholder="Seleccionar"
                    />
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <Button variant="primary" onClick={handleSubmit}>
                    Actualizar
                </Button>

                <Button variant="outline" onClick={handleClear}>
                    Limpiar
                </Button>

                {selectedUser && (
                    <Button variant="outline" onClick={handleDelete}>
                        <TrashBinIcon />
                        Eliminar
                    </Button>
                )}
            </div>
        </div>
    );
}
