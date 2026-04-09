import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute() {
  const { authLoading, isAuthenticated, isAdmin } = useAuth();

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
