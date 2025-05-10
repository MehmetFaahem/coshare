import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { saveLastRoute, getAuthTokenKey } from "../../lib/sessionHelper";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isEmailConfirmed } = useAuth();
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

  // If not authenticated or no token, redirect to login
  if (!isAuthenticated && !hasToken) {
    console.log("Access denied to protected route:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but email not confirmed, redirect to email confirmation
  if (isAuthenticated && !isEmailConfirmed) {
    console.log("Email not confirmed, redirecting to confirmation page");
    return (
      <Navigate to="/email-confirmation" state={{ from: location }} replace />
    );
  }

  // If authenticated and email confirmed, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
