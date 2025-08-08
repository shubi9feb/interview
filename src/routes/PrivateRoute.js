import { Navigate } from "react-router-dom";
import { isTokenValid, logout } from "../api/authService.js";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  // Check if no token or token expired
  if (!token || !isTokenValid(token)) {
    logout();
    alert("You must be logged in to access this page.");
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
