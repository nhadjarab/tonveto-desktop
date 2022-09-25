import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RequireAuth = ({ children }) => {
  const {user} = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" state={{ from: location }} replace />;

  return children;
};

export default RequireAuth;
