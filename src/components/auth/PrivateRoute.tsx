import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { saveLastRoute, getAuthTokenKey } from "../../lib/sessionHelper";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasToken, setHasToken] = useState(false);

  // Check for token directly in localStorage
  useEffect(() => {
    const tokenKey = getAuthTokenKey();
    const token = localStorage.getItem(tokenKey);
    setHasToken(!!token);

    if (!isAuthenticated && !token) {
      console.log("No auth token, saving route:", location.pathname);
      saveLastRoute(location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  // If authenticated or has token, render the protected component
  if (isAuthenticated || hasToken) {
    return <>{children}</>;
  }

  // Otherwise redirect to login
  console.log("Access denied to protected route:", location.pathname);
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
