import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RideProvider } from "./contexts/RideContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AblyProvider } from "./contexts/AblyContext";
import { toast } from "react-hot-toast";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateRidePage from "./pages/CreateRidePage";
import FindRidesPage from "./pages/FindRidesPage";
import RideDetailPage from "./pages/RideDetailPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";

// Add custom styles for leaflet markers
import "./index.css";
import PrivateRoute from "./components/auth/PrivateRoute";

// Component to handle email verification callback
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Process the verification and refresh the session
        await refreshSession();
        toast.success("Email verified successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Email verification error:", error);
        toast.error("Failed to verify email. Please try again later.");
        navigate("/login");
      }
    };

    // If verification parameters exist in URL, handle them
    if (searchParams.get("type") === "email_confirmation") {
      handleVerification();
    } else {
      navigate("/login");
    }
  }, [searchParams, refreshSession, navigate]);

  return <div>Verifying your email...</div>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AblyProvider>
          <RideProvider>
            <NotificationProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#FFFFFF",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#FFFFFF",
                    },
                  },
                }}
              />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/email-confirmation"
                  element={<EmailConfirmationPage />}
                />
                <Route path="/auth/verify" element={<VerifyEmail />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-ride"
                  element={
                    <PrivateRoute>
                      <CreateRidePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rides"
                  element={
                    <PrivateRoute>
                      <FindRidesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rides/:id"
                  element={
                    <PrivateRoute>
                      <RideDetailPage />
                    </PrivateRoute>
                  }
                />

                {/* Redirect any unmatched routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NotificationProvider>
          </RideProvider>
        </AblyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
