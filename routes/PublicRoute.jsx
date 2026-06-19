import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  if (isLoggedIn && userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isLoggedIn && userRole === "staff") {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;