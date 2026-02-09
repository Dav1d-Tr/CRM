// src/context/RequireAuth.tsx
import { Navigate, Outlet } from "react-router";

type Props = {
  allowedRoles?: number[];
};

export default function RequireAuth({ allowedRoles }: Props) {
  const userRaw = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userRaw || !token) {
    return <Navigate to="/signup" replace />;
  }

  const user = JSON.parse(userRaw);

  // Si la ruta tiene restricción de roles
  if (allowedRoles && !allowedRoles.includes(user.userRoleId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
