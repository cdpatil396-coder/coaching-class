import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  role
}) {

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (!token) {

    return <Navigate to="/login" replace />;

  }

  if (!user || !["admin", "student"].includes(user.role)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {

    return (
      <Navigate
        to={user?.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );

  }

  return children;
}

export default ProtectedRoute;
