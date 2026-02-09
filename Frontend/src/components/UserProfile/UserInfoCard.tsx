import { useEffect, useState } from "react";

export default function UserInfoCard() {
  
  const [user, setUser] = useState<any>(null);

  const loadUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, []);

  if (!user) return null;

  return (
    <div className="p-5 border border-gray-500 rounded-2xl lg:p-6">
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">Información Personal</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Documento" value={user.id} />
        <Info label="Tipo de Documento:" value={String(user.documentName)} />
        <Info label="Nombre" value={user.name} />
        <Info label="Apellido" value={user.lastName} />
        <Info label="Email" value={user.email} />
        <Info label="Teléfono" value={user.numberPhone} />
        <Info label="Rol" value={String(user.roleName)} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg dark:text-white/90">{label}</p>
      <p className="text-base font-medium text-gray-800 dark:text-white/90">{value || "-"}</p>
    </div>
  );
}
