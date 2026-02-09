import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import UsersForm from "../components/admin/UsersForm";
import TableUsers from "../components/admin/TableUsers";
import { API_BASE } from "../config/api";
import { authFetch } from "../services/authFetch";

export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    numberPhone: string;
    roleName?: string;
    roleId: number;
    documentId: number;
}

interface Role {
    id: number;
    name: string;
}

interface DocumentType {
    id: number;
    name: string;
}

export default function UsersAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [documents, setDocuments] = useState<DocumentType[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User | null>(null);

    const loadUsers = async () => {
        const data: User[] = await authFetch(`${API_BASE}/user`);
        setUsers(data);
    };

    const loadRoles = async () => {
        const data: Role[] = await authFetch(`${API_BASE}/userRole`);
        setRoles(data);
    };

    const loadDocuments = async () => {
        const data: DocumentType[] = await authFetch(`${API_BASE}/typeDocument`);
        setDocuments(data);
    };

    useEffect(() => {
        loadUsers();
        loadRoles();
        loadDocuments();
    }, []);

    return (
        <>
            <PageMeta title="Usuarios" description="Admin" />
            <PageBreadcrumb pageTitle="Usuarios" />

            <div className="mt-28 space-y-6 px-4 lg:p-6">
                <UsersForm
                    selectedUser={selectedUsers}
                    clearSelection={() => setSelectedUsers(null)}
                    reload={loadUsers}
                    roles={roles}
                    documents={documents}
                />

                <TableUsers
                    products={users}
                    onLoad={(p: User) => setSelectedUsers(p)}
                />
            </div>
        </>
    );
}
