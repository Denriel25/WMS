import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "staff") {
      return <Navigate to="/staff/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;