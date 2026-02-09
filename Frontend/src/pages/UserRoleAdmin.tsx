import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import RoleForm from "../components/admin/RoleForm";
import TableRole from "../components/admin/TableRole";
import { API_BASE } from "../config/api";
import { authFetch } from "../services/authFetch";

// Tipo

interface UserRole {
  id: number;
  name: string;
  status: boolean;
}

export default function CountryAdmin() {

  const [roles, setRoles] = useState<UserRole[]>([]);
const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);


  const loadRoles = async () => {
    const data: UserRole[] = await authFetch(`${API_BASE}/userRole`);

    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <>
      <PageMeta title="Países" description="Admin" />
      <PageBreadcrumb pageTitle="Roles de Usuario" />

      <div className="mt-28 space-y-6 px-4 lg:p-6">
        <RoleForm
          selectedUserRole={selectedUserRole}
          clearSelection={() => setSelectedUserRole(null)}
          reload={loadRoles}
        />

        <TableRole
          roles={roles}
          onLoad={(country: UserRole) => setSelectedUserRole(country)}
        />
      </div>
    </>
  );
}
