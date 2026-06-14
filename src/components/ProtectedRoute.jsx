import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  if (!sesion) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;