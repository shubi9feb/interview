import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role")?.toLowerCase();

  if (!token) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
