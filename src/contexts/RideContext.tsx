import React, { createContext, useContext, useState, useEffect } from "react";
import { RideRequest, Location, RideStatus } from "../types";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { supabase } from "../lib/supabase";

interface RideContextType {
  rides: RideRequest[];
  userRides: RideRequest[];
  loading: boolean;
  createRideRequest: (
    startingPoint: Location,
    destination: Location,
    totalSeats: number,
    contactPhone: string
  ) => Promise<RideRequest>;
  joinRideRequest: (rideId: string, contactPhone: string) => Promise<void>;
  cancelRideRequest: (rideId: string) => Promise<void>;
  completeRideRequest: (rideId: string) => Promise<void>;
  findMatchingRides: (
    startPoint: Location,
    endPoint: Location
  ) => RideRequest[];
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();

  // Load rides from Supabase
  useEffect(() => {
    const fetchRides = async () => {
      try {
        // With RLS enabled, this will only return rides the user can access
        const { data, error } = await supabase.from("ride_requests").select(`
            id,
            creator_id,
            starting_point,
            destination,
            seats_available,
            total_seats,
            status,
            created_at
          `);

        if (error) {
          console.error("Error fetching rides:", error);
          setLoading(false);
          return;
        }

        if (data) {
          // Transform data to match our RideRequest type
          const transformedRides = await Promise.all(
            data.map(async (ride) => {
              // Fetch passengers for each ride
              const { data: passengers, error: passengersError } =
                await supabase
                  .from("ride_passengers")
                  .select("user_id")
                  .eq("ride_id", ride.id);

              if (passengersError) {
                console.error("Error fetching passengers:", passengersError);
                return null;
              }

              const passengerIds = passengers
                ? passengers.map((p) => p.user_id)
                : [];

              return {
                id: ride.id,
                creator: ride.creator_id,
                startingPoint: ride.starting_point as Location,
                destination: ride.destination as Location,
                seatsAvailable: ride.seats_available,
                totalSeats: ride.total_seats,
                passengers: passengerIds,
                status: ride.status as RideStatus,
                createdAt: ride.created_at,
              };
            })
          );

          // Filter out any null values that might have come from errors
          setRides(transformedRides.filter(Boolean) as RideRequest[]);
        }
      } catch (error) {
        console.error("Error in ride fetching process:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Set up subscription for real-time updates
    const rideSubscription = supabase
      .channel("ride_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_requests",
        },
        () => {
          fetchRides();
        }
      )
      .subscribe();

    const passengerSubscription = supabase
      .channel("passenger_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_passengers",
        },
        () => {
          fetchRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rideSubscription);
      supabase.removeChannel(passengerSubscription);
    };
  }, [user]); // Add user as a dependency to refetch when the user changes

  // Filter rides that the current user is part of
  const userRides = rides.filter(
    (ride) =>
      user && (ride.creator === user.id || ride.passengers.includes(user.id))
  );

  const createRideRequest = async (
    startingPoint: Location,
    destination: Location,
    totalSeats: number,
    contactPhone: string
  ): Promise<RideRequest> => {
    if (!user) throw new Error("User must be logged in");

    try {
      // Insert ride request
      const { data: rideData, error: rideError } = await supabase
        .from("ride_requests")
        .insert({
          creator_id: user.id,
          starting_point: startingPoint,
          destination: destination,
          seats_available: totalSeats - 1, // Creator takes one seat
          total_seats: totalSeats,
          status: "open",
          contact_phone: contactPhone,
        })
        .select()
        .single();

      if (rideError) {
        console.error("Error creating ride:", rideError);
        throw new Error(rideError.message);
      }

      if (!rideData) {
        throw new Error("Failed to create ride");
      }

      // Insert creator as a passenger
      const { error: passengerError } = await supabase
        .from("ride_passengers")
        .insert({
          ride_id: rideData.id,
          user_id: user.id,
          contact_phone: contactPhone,
        });

      if (passengerError) {
        console.error("Error adding passenger:", passengerError);
        throw new Error(passengerError.message);
      }

      // Create ride object for the client
      const newRide: RideRequest = {
        id: rideData.id,
        creator: user.id,
        startingPoint,
        destination,
        seatsAvailable: totalSeats - 1,
        totalSeats,
        passengers: [user.id],
        status: "open",
        createdAt: rideData.created_at,
        contactPhone: contactPhone,
      };

      // Update local state
      setRides((prevRides) => [...prevRides, newRide]);

      // Emit socket event for real-time updates
      if (socket) {
        socket.emit("ride:new", newRide);
      }

      return newRide;
    } catch (error) {
      console.error("Error creating ride:", error);
      throw error;
    }
  };

  const joinRideRequest = async (
    rideId: string,
    contactPhone: string
  ): Promise<void> => {
    if (!user) throw new Error("User must be logged in");

    // Find ride
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) throw new Error("Ride not found");

    // Check if user is already in the ride
    if (ride.passengers.includes(user.id)) {
      throw new Error("You are already in this ride");
    }

    // Check if ride is full
    if (ride.seatsAvailable <= 0 || ride.status !== "open") {
      throw new Error("This ride is no longer available");
    }

    try {
      // Add user as a passenger
      const { error: passengerError } = await supabase
        .from("ride_passengers")
        .insert({
          ride_id: rideId,
          user_id: user.id,
          contact_phone: contactPhone,
        });

      if (passengerError) {
        console.error("Error joining ride:", passengerError);
        throw new Error(passengerError.message);
      }

      // Update ride available seats
      const newSeatsAvailable = ride.seatsAvailable - 1;
      const newStatus = newSeatsAvailable <= 0 ? "full" : "open";

      const { error: rideError } = await supabase.from("ride_requests").upsert({
        id: rideId,
        creator_id: ride.creator,
        starting_point: ride.startingPoint,
        destination: ride.destination,
        seats_available: newSeatsAvailable,
        total_seats: ride.totalSeats,
        status: newStatus,
      });

      if (rideError) {
        console.error("Error updating ride:", rideError);
        throw new Error(rideError.message);
      }

      // Update local state
      const updatedRide = {
        ...ride,
        seatsAvailable: newSeatsAvailable,
        status: newStatus as RideStatus,
        passengers: [...ride.passengers, user.id],
      };

      setRides((prevRides) =>
        prevRides.map((r) => (r.id === rideId ? updatedRide : r))
      );

      // Emit socket event
      if (socket) {
        socket.emit("ride:update", updatedRide);
        socket.emit("ride:join", updatedRide);
      }
    } catch (error) {
      console.error("Error joining ride:", error);
      throw error;
    }
  };

  const cancelRideRequest = async (rideId: string): Promise<void> => {
    if (!user) throw new Error("User must be logged in");

    // Find ride
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) throw new Error("Ride not found");

    // Check if user is part of the ride
    if (ride.creator !== user.id && !ride.passengers.includes(user.id)) {
      throw new Error("You are not part of this ride");
    }

    try {
      // If user is the creator, cancel the entire ride
      if (ride.creator === user.id) {
        const { error } = await supabase.from("ride_requests").upsert({
          id: rideId,
          creator_id: ride.creator,
          starting_point: ride.startingPoint,
          destination: ride.destination,
          seats_available: ride.seatsAvailable,
          total_seats: ride.totalSeats,
          status: "cancelled",
        });

        if (error) {
          console.error("Error canceling ride:", error);
          throw new Error(error.message);
        }

        // Update local state
        const updatedRide = {
          ...ride,
          status: "cancelled" as RideStatus,
        };

        setRides((prevRides) =>
          prevRides.map((r) => (r.id === rideId ? updatedRide : r))
        );

        // Emit socket event
        if (socket) {
          socket.emit("ride:update", updatedRide);
        }
      } else {
        // If user is just a passenger, remove them from the ride
        const { error: passengerError } = await supabase
          .from("ride_passengers")
          .delete()
          .eq("ride_id", rideId)
          .eq("user_id", user.id);

        if (passengerError) {
          console.error("Error removing passenger:", passengerError);
          throw new Error(passengerError.message);
        }

        // Update ride available seats
        const { error: rideError } = await supabase
          .from("ride_requests")
          .upsert({
            id: rideId,
            creator_id: ride.creator,
            starting_point: ride.startingPoint,
            destination: ride.destination,
            seats_available: ride.seatsAvailable + 1,
            total_seats: ride.totalSeats,
            status: "open",
          });

        if (rideError) {
          console.error("Error updating ride:", rideError);
          throw new Error(rideError.message);
        }

        // Update local state
        const updatedRide = {
          ...ride,
          seatsAvailable: ride.seatsAvailable + 1,
          status: "open" as RideStatus,
          passengers: ride.passengers.filter((id) => id !== user.id),
        };

        setRides((prevRides) =>
          prevRides.map((r) => (r.id === rideId ? updatedRide : r))
        );

        // Emit socket event
        if (socket) {
          socket.emit("ride:update", updatedRide);
        }
      }
    } catch (error) {
      console.error("Error canceling ride:", error);
      throw error;
    }
  };

  const completeRideRequest = async (rideId: string): Promise<void> => {
    if (!user) throw new Error("User must be logged in");

    // Find ride
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) throw new Error("Ride not found");

    // Check if user is the creator
    if (ride.creator !== user.id) {
      throw new Error("Only the ride creator can complete a ride");
    }

    try {
      // Use upsert (PUT) instead of update (PATCH) to avoid CORS issues
      // Include all required fields to prevent not-null constraint violations
      const { error } = await supabase.from("ride_requests").upsert({
        id: rideId,
        creator_id: ride.creator,
        starting_point: ride.startingPoint,
        destination: ride.destination,
        seats_available: ride.seatsAvailable,
        total_seats: ride.totalSeats,
        status: "completed",
      });

      if (error) {
        console.error("Error completing ride:", error);
        throw new Error(error.message);
      }

      // Update local state
      const updatedRide = {
        ...ride,
        status: "completed" as RideStatus,
      };

      setRides((prevRides) =>
        prevRides.map((r) => (r.id === rideId ? updatedRide : r))
      );

      // Emit socket event
      if (socket) {
        socket.emit("ride:update", updatedRide);
      }
    } catch (error) {
      console.error("Error completing ride:", error);
      throw error;
    }
  };

  const calculateDistance = (loc1: Location, loc2: Location): number => {
    // Simple Euclidean distance calculation
    const latDiff = loc1.coordinates.lat - loc2.coordinates.lat;
    const lngDiff = loc1.coordinates.lng - loc2.coordinates.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  };

  const findMatchingRides = (
    startPoint: Location,
    endPoint: Location
  ): RideRequest[] => {
    // Find rides where both starting point and destination are within 1km of the given points
    return rides.filter(
      (ride) =>
        ride.status === "open" &&
        calculateDistance(ride.startingPoint, startPoint) <= 0.01 && // Approx 1km in latitude/longitude
        calculateDistance(ride.destination, endPoint) <= 0.01
    );
  };

  return (
    <RideContext.Provider
      value={{
        rides,
        userRides,
        loading,
        createRideRequest,
        joinRideRequest,
        cancelRideRequest,
        completeRideRequest,
        findMatchingRides,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
};
