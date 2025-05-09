import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { RideProvider } from "./contexts/RideContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SocketProvider } from "./contexts/SocketContext";
import PrivateRoute from "./components/auth/PrivateRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateRidePage from "./pages/CreateRidePage";
import FindRidesPage from "./pages/FindRidesPage";
import RideDetailPage from "./pages/RideDetailPage";

// Add custom styles for leaflet markers
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
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
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
