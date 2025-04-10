// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or useContext for auth state
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
