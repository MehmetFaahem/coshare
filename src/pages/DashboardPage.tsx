import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useRide } from "../contexts/RideContext";
import { useAbly } from "../contexts/AblyContext";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus, MapPin, ChevronsRight, TrendingUp, Clock, CheckCircle } from "lucide-react";
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
    console.log(
      "Dashboard updating from context:",
      rides.length,
      "total rides,",
      userRides.length,
      "user rides"
    );
    setDashboardRides(rides);
    setDashboardUserRides(userRides);
  }, [rides, userRides]);

  // Subscribe to real-time updates
  useEffect(() => {
    const activeUser = user || tokenUser;
    if (!activeUser) return;

    const handleRideUpdate = (message: { data: RideRequest }) => {
      const updatedRide = message.data;
      console.log(
        "Dashboard received ride update:",
        updatedRide.status,
        updatedRide.id
      );

      // Update rides list
      setDashboardRides((prevRides) => {
        // Replace the ride if it exists, otherwise add it
        const exists = prevRides.some((ride) => ride.id === updatedRide.id);
        if (exists) {
          return prevRides.map((ride) =>
            ride.id === updatedRide.id ? updatedRide : ride
          );
        } else {
          return [...prevRides, updatedRide];
        }
      });

      // Check if this is a user ride
      const isUserRide =
        updatedRide.creator === activeUser.id ||
        updatedRide.passengers.includes(activeUser.id);

      if (isUserRide) {
        console.log("Updating user ride in dashboard:", updatedRide.status);
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

  // Calculate stats
  const activeRides = dashboardUserRides.filter(
    (ride) => ride.status === "open" || ride.status === "full"
  );
  const completedRides = dashboardUserRides.filter(
    (ride) => ride.status === "completed"
  );
  const pastRides = dashboardUserRides.filter(
    (ride) => ride.status === "completed" || ride.status === "cancelled"
  );
  const availableRides = dashboardRides.filter(
    (ride) => ride.status === "open" && ride.seatsAvailable > 0
  ).length;

  const displayUser = user || tokenUser;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent-50 to-secondary-50">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {displayUser?.name || "User"}!
                  </h1>
                  <p className="text-xl text-gray-600">
                    Manage your rides and discover new journey companions
                  </p>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/create-ride"
                    className="btn-modern px-6 py-3 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-large flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Create Ride
                  </Link>
                  <Link
                    to="/rides"
                    className="px-6 py-3 bg-white text-accent-600 border-2 border-accent-200 hover:border-accent-400 rounded-2xl font-semibold transition-all duration-300 hover:bg-accent-50 flex items-center justify-center gap-2"
                  >
                    <MapPin className="h-5 w-5" />
                    Find Rides
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card-hover bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-2xl bg-accent-100">
                  <Users className="h-8 w-8 text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Active Rides
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeRides.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-2xl bg-secondary-100">
                  <CheckCircle className="h-8 w-8 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedRides.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-2xl bg-green-100">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Available Rides
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {availableRides}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-hover bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-2xl bg-purple-100">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Total Rides
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardUserRides.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Rides Section */}
          <div className="mb-12">
            <div className="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Active Rides
                  </h2>
                  <p className="text-gray-600">
                    Manage your ongoing ride requests and bookings
                  </p>
                </div>
                <Link
                  to="/rides"
                  className="group flex items-center text-accent-600 hover:text-accent-700 font-semibold transition-colors"
                >
                  View All
                  <ChevronsRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <RideList
                rides={activeRides}
                emptyMessage="You don't have any active rides. Create a new ride or join an existing one to get started!"
              />
            </div>
          </div>

          {/* Past Rides Section */}
          {pastRides.length > 0 && (
            <div className="bg-white rounded-3xl shadow-large p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Recent Rides
                </h2>
                <p className="text-gray-600">
                  Your ride history and completed journeys
                </p>
              </div>
              <RideList rides={pastRides.slice(0, 4)} showActions={false} />
              {pastRides.length > 4 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/rides"
                    className="text-accent-600 hover:text-accent-700 font-semibold"
                  >
                    View all past rides
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
