import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export const ProtectedRoute = ({ allowRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowRoles && allowRoles.length > 0 && !allowRoles.includes(user?.role)) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return <Outlet />;
};

