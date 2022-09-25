import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireNotAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) return <Navigate to="/home" state={{ from: location }} replace />;
  return children;
};

export default RequireNotAuth;
