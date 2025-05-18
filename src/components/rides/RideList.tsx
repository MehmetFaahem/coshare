import React, { useState, useEffect } from "react";
import { RideRequest } from "../../types";
import RideCard from "./RideCard";
import { useRide } from "../../contexts/RideContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  // Track rides in state just for logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "RideList: Current ride IDs:",
        rides.map((r) => r.id).join(", ")
      );
    }
  }, [rides]);

  const handleJoinClick = async (rideId: string) => {
    // Sync ride status before joining
    await syncRideStatus(rideId);

    // Check if ride is still joinable after sync
    const updatedRide = rides.find((r) => r.id === rideId);
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
      const selectedRide = rides.find((r) => r.id === selectedRideId);
      if (
        !selectedRide ||
        selectedRide.status !== "open" ||
        selectedRide.seatsAvailable <= 0
      ) {
        toast.error("This ride is no longer available");
        return;
      }

      await joinRideRequest(selectedRideId, phoneNumber);
      const ride = rides.find((r) => r.id === selectedRideId);
      if (ride) {
        addNotification(
          `You have joined a ride to ${ride.destination.address}.`,
          "join",
          selectedRideId
        );
      }
      toast.success("Successfully joined the ride");

      // Redirect to the ride details page
      navigate(`/rides/${selectedRideId}`);
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
      const updatedRide = rides.find((r) => r.id === rideId);
      if (
        !updatedRide ||
        updatedRide.status === "completed" ||
        updatedRide.status === "cancelled"
      ) {
        toast.error(`Ride is already ${updatedRide?.status}`);
        return;
      }

      await cancelRideRequest(rideId);
      const ride = rides.find((r) => r.id === rideId);
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
      const updatedRide = rides.find((r) => r.id === rideId);
      if (
        !updatedRide ||
        updatedRide.status === "completed" ||
        updatedRide.status === "cancelled"
      ) {
        toast.error(`Ride is already ${updatedRide?.status}`);
        return;
      }

      await completeRideRequest(rideId);
      const ride = rides.find((r) => r.id === rideId);
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

  if (rides.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rides.map((ride) => (
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
