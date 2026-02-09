import { Navigate, Outlet } from "react-router";

type Props = {
  allowedRoles?: string[];
};

export default function ProtectedContext({ allowedRoles }: Props) {
  const userRaw = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  
  if (!userRaw || !token) {
    return <Navigate to="/signin" replace />;
  }

  const user = JSON.parse(userRaw);
  
  const roleName =
    user?.roleName ||
    user?.role?.name ||
    user?.UserRole?.name;

  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
