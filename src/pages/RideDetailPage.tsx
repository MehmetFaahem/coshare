import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import RideDetail from "../components/rides/RideDetail";
import { useRide } from "../contexts/RideContext";
import { useAuth } from "../contexts/AuthContext";

const RideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { rides } = useRide();
  const { isAuthenticated, isLoading } = useAuth();

  // Find the ride by ID
  const ride = rides.find((r) => r.id === id);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If ride not found
  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ride Not Found
            </h2>
            <p className="text-gray-600">
              The ride you're looking for doesn't exist or has been removed.
            </p>
            <a
              href="/rides"
              className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Find Other Rides
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RideDetail ride={ride} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RideDetailPage;
