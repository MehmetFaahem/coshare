import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useRide } from "../contexts/RideContext";
import { useAbly } from "../contexts/AblyContext";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus, MapPin, ChevronsRight } from "lucide-react";
import RideList from "../components/rides/RideList";
import { getAuthTokenKey } from "../lib/sessionHelper";
import { RideRequest } from "../types";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userRides, rides } = useRide();
  const { subscribeToEvent } = useAbly();
  const navigate = useNavigate();
  const [tokenUser, setTokenUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [dashboardRides, setDashboardRides] = useState<RideRequest[]>([]);
  const [dashboardUserRides, setDashboardUserRides] = useState<RideRequest[]>(
    []
  );

  // Update local state when the rides context changes
  useEffect(() => {
    setDashboardRides(rides);
    setDashboardUserRides(userRides);
  }, [rides, userRides]);

  // Subscribe to real-time updates
  useEffect(() => {
    const activeUser = user || tokenUser;
    if (!activeUser) return;

    const handleRideUpdate = (message: { data: RideRequest }) => {
      const updatedRide = message.data;

      // Update rides list
      setDashboardRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === updatedRide.id ? updatedRide : ride
        )
      );

      // Check if this is a user ride
      const isUserRide =
        updatedRide.creator === activeUser.id ||
        updatedRide.passengers.includes(activeUser.id);

      if (isUserRide) {
        setDashboardUserRides((prevUserRides) => {
          // Check if ride already exists in user rides
          const rideExists = prevUserRides.some(
            (ride) => ride.id === updatedRide.id
          );

          if (rideExists) {
            // Update existing ride
            return prevUserRides.map((ride) =>
              ride.id === updatedRide.id ? updatedRide : ride
            );
          } else {
            // Add new ride
            return [...prevUserRides, updatedRide];
          }
        });
      }
    };

    const handleNewRide = (message: { data: RideRequest }) => {
      const newRide = message.data;

      // Add to rides list if it's not already there
      setDashboardRides((prevRides) => {
        if (prevRides.some((ride) => ride.id === newRide.id)) {
          return prevRides;
        }
        return [...prevRides, newRide];
      });

      // Check if this is a user ride
      const isUserRide =
        newRide.creator === activeUser.id ||
        newRide.passengers.includes(activeUser.id);

      if (isUserRide) {
        setDashboardUserRides((prevUserRides) => {
          if (prevUserRides.some((ride) => ride.id === newRide.id)) {
            return prevUserRides;
          }
          return [...prevUserRides, newRide];
        });
      }
    };

    // Subscribe to ride events
    const unsubscribeUpdate = subscribeToEvent(
      "rides",
      "update",
      handleRideUpdate
    );
    const unsubscribeJoin = subscribeToEvent("rides", "join", handleRideUpdate);
    const unsubscribeLeave = subscribeToEvent(
      "rides",
      "leave",
      handleRideUpdate
    );
    const unsubscribeNew = subscribeToEvent("rides", "new", handleNewRide);

    return () => {
      unsubscribeUpdate();
      unsubscribeJoin();
      unsubscribeLeave();
      unsubscribeNew();
    };
  }, [user, tokenUser, subscribeToEvent]);

  // Check for token directly
  useEffect(() => {
    if (!isAuthenticated) {
      // Check localStorage for token
      const tokenKey = getAuthTokenKey();
      const token = localStorage.getItem(tokenKey);

      if (token) {
        try {
          const tokenData = JSON.parse(token);
          if (tokenData.user && tokenData.user.id) {
            // Create user from token data
            const user = {
              id: tokenData.user.id,
              name:
                tokenData.user.user_metadata?.name ||
                tokenData.user.user_metadata?.full_name ||
                tokenData.user.email?.split("@")[0] ||
                "User",
              email: tokenData.user.email || "",
            };
            setTokenUser(user);
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          navigate("/login");
        }
      } else {
        // No token, redirect to login
        navigate("/login");
      }
    }
  }, [isAuthenticated, navigate]);

  // Get the active user - either from auth context or token
  const activeUser = user || tokenUser;

  // If no user available, show login message
  if (!activeUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">
              Please log in to view your dashboard.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-md"
            >
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Find active and past rides
  const activeRides = dashboardUserRides.filter(
    (ride) => ride.status === "open" || ride.status === "full"
  );
  const pastRides = dashboardUserRides.filter(
    (ride) => ride.status === "completed" || ride.status === "cancelled"
  );

  // Calculate stats
  const totalRides = dashboardUserRides.length;
  const completedRides = dashboardUserRides.filter(
    (ride) => ride.status === "completed"
  ).length;
  const availableRides = dashboardRides.filter(
    (r) =>
      r.status === "open" && !dashboardUserRides.some((ur) => ur.id === r.id)
  ).length;

  // Main dashboard content
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {activeUser?.name || "User"}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your ride requests and find passengers for your trips.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 mr-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Total Rides</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalRides}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {completedRides}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-amber-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">
                    Active Rides
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {activeRides.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-600"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                    <path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">
                    Available Rides
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {availableRides}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/create-ride"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Ride
              </Link>
              <Link
                to="/rides"
                className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-md border border-gray-300 flex items-center transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                Find Rides
              </Link>
            </div>
          </div>

          {/* Active Rides */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Active Rides
              </h2>
              <Link
                to="/rides"
                className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
              >
                View All
                <ChevronsRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <RideList
              rides={activeRides}
              emptyMessage="You don't have any active rides. Create a new ride or join an existing one."
            />
          </div>

          {/* Past Rides */}
          {pastRides.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Past Rides
              </h2>
              <RideList rides={pastRides.slice(0, 4)} showActions={false} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
