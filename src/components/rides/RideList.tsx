import React, { useState, useEffect, useRef } from "react";
import { RideRequest } from "../../types";
import RideCard from "./RideCard";
import { useRide } from "../../contexts/RideContext";
import { toast } from "react-hot-toast";
import { useNotification } from "../../contexts/NotificationContext";
import PhoneNumberModal from "./PhoneNumberModal";

interface RideListProps {
  rides: RideRequest[];
  showActions?: boolean;
  emptyMessage?: string;
}

const RideList: React.FC<RideListProps> = ({
  rides,
  showActions = true,
  emptyMessage = "No rides found",
}) => {
  const {
    joinRideRequest,
    cancelRideRequest,
    completeRideRequest,
    syncRideStatus,
  } = useRide();
  const { addNotification } = useNotification();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [displayedRides, setDisplayedRides] = useState<RideRequest[]>(rides);

  // Create a key to force re-render when ride data changes
  const rideListKey = useRef(Date.now());

  // Track previous ride count for debugging
  const prevRideCount = useRef(rides.length);

  // Update displayedRides whenever the rides prop changes
  useEffect(() => {
    const oldCount = prevRideCount.current;
    const newCount = rides.length;

    if (oldCount !== newCount) {
      console.log(
        `RideList: Ride count changed from ${oldCount} to ${newCount}`
      );
    }

    // Store new count
    prevRideCount.current = newCount;

    // Update state and force re-render
    setDisplayedRides(rides);
    rideListKey.current = Date.now();

    // Log the current ride IDs for debugging
    console.log(
      "RideList: Current ride IDs:",
      rides.map((r) => r.id).join(", ")
    );
  }, [rides]);

  // On component mount and every 5 seconds, force re-render to ensure rides are up to date
  useEffect(() => {
    // Force an immediate re-render
    const immediateTimer = setTimeout(() => {
      rideListKey.current = Date.now();
      // This forced state update ensures a re-render
      setDisplayedRides([...displayedRides]);
    }, 100);

    // Set up interval for periodic re-renders
    const interval = setInterval(() => {
      rideListKey.current = Date.now();
      // This forced state update ensures a re-render
      setDisplayedRides([...displayedRides]);
    }, 5000);

    return () => {
      clearTimeout(immediateTimer);
      clearInterval(interval);
    };
  }, [displayedRides]);

  const handleJoinClick = async (rideId: string) => {
    // Sync ride status before joining
    await syncRideStatus(rideId);

    // Check if ride is still joinable after sync
    const updatedRide = displayedRides.find((r) => r.id === rideId);
    if (
      !updatedRide ||
      updatedRide.status !== "open" ||
      updatedRide.seatsAvailable <= 0
    ) {
      toast.error("This ride is no longer available");
      return;
    }

    setSelectedRideId(rideId);
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = async (phoneNumber: string) => {
    if (!selectedRideId) return;

    setShowPhoneModal(false);
    try {
      // Sync ride status before joining
      await syncRideStatus(selectedRideId);

      // Re-check if ride is still joinable
      const selectedRide = displayedRides.find((r) => r.id === selectedRideId);
      if (
        !selectedRide ||
        selectedRide.status !== "open" ||
        selectedRide.seatsAvailable <= 0
      ) {
        toast.error("This ride is no longer available");
        return;
      }

      await joinRideRequest(selectedRideId, phoneNumber);
      const ride = displayedRides.find((r) => r.id === selectedRideId);
      if (ride) {
        addNotification(
          `You have joined a ride to ${ride.destination.address}.`,
          "join",
          selectedRideId
        );
      }
      toast.success("Successfully joined the ride");
    } catch (error) {
      toast.error("Failed to join ride");
      console.error(error);
    } finally {
      setSelectedRideId(null);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    try {
      // Sync ride status before cancelling
      await syncRideStatus(rideId);

      // Check if ride is still cancellable after sync
      const updatedRide = displayedRides.find((r) => r.id === rideId);
      if (
        !updatedRide ||
        updatedRide.status === "completed" ||
        updatedRide.status === "cancelled"
      ) {
        toast.error(`Ride is already ${updatedRide?.status}`);
        return;
      }

      await cancelRideRequest(rideId);
      const ride = displayedRides.find((r) => r.id === rideId);
      if (ride) {
        addNotification(
          `You have cancelled your ride to ${ride.destination.address}.`,
          "update",
          rideId
        );
      }
      toast.success("Ride cancelled successfully");
    } catch (error) {
      toast.error(
        "Failed to cancel ride. The ride might have already been completed."
      );
      console.error(error);
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      // Sync ride status before completing
      await syncRideStatus(rideId);

      // Check if ride is still completable after sync
      const updatedRide = displayedRides.find((r) => r.id === rideId);
      if (
        !updatedRide ||
        updatedRide.status === "completed" ||
        updatedRide.status === "cancelled"
      ) {
        toast.error(`Ride is already ${updatedRide?.status}`);
        return;
      }

      await completeRideRequest(rideId);
      const ride = displayedRides.find((r) => r.id === rideId);
      if (ride) {
        addNotification(
          `Your ride to ${ride.destination.address} has been completed.`,
          "update",
          rideId
        );
      }
      toast.success("Ride completed successfully");
    } catch (error) {
      toast.error("Failed to complete ride");
      console.error(error);
    }
  };

  if (displayedRides.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div key={rideListKey.current}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedRides.map((ride) => (
          <RideCard
            key={`${ride.id}-${ride.status}-${ride.seatsAvailable}`}
            ride={ride}
            onJoin={showActions ? handleJoinClick : undefined}
            onCancel={showActions ? handleCancelRide : undefined}
            onComplete={showActions ? handleCompleteRide : undefined}
          />
        ))}
      </div>

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={handlePhoneSubmit}
      />
    </div>
  );
};

export default RideList;
