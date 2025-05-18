import React, { useState, useEffect, useCallback } from "react";
import { RideRequest } from "../../types";
import { MapPin, Navigation, Users, Calendar, User, Phone } from "lucide-react";
import RideMap from "../map/RideMap";
import { useAuth } from "../../contexts/AuthContext";
import { useRide } from "../../contexts/RideContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";
import PhoneNumberModal from "./PhoneNumberModal";
import { supabase } from "../../lib/supabase";

interface RideDetailProps {
  ride: RideRequest;
}

// New interface for passenger info including phone
interface PassengerInfo {
  id: string;
  isCreator: boolean;
  contactPhone?: string;
}

const RideDetail: React.FC<RideDetailProps> = ({ ride }) => {
  const { user } = useAuth();
  const {
    joinRideRequest,
    cancelRideRequest,
    completeRideRequest,
    syncRideStatus,
  } = useRide();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);

  const isCreator = user && ride.creator === user.id;
  const isPassenger = user && ride.passengers.includes(user.id);
  const canJoin =
    user && !isPassenger && ride.status === "open" && ride.seatsAvailable > 0;
  const canLeaveOrCancel =
    isPassenger && ride.status !== "completed" && ride.status !== "cancelled";
  const canComplete =
    isCreator && ride.status !== "completed" && ride.status !== "cancelled";

  // Sync ride status when component mounts or ride id changes
  useEffect(() => {
    if (ride.id) {
      syncRideStatus(ride.id);
    }
  }, [ride.id, syncRideStatus]);

  // Fetch passengers info - memoized to avoid unnecessary rerenders
  const fetchPassengersInfo = useCallback(async () => {
    try {
      // Get passenger info including phone numbers
      const { data, error } = await supabase
        .from("ride_passengers")
        .select("user_id, contact_phone")
        .eq("ride_id", ride.id);

      if (error) {
        console.error("Error fetching passengers:", error);
        // Create fallback passenger data using the ride's passengers array
        const fallbackPassengers: PassengerInfo[] = ride.passengers.map(
          (passengerId) => ({
            id: passengerId,
            isCreator: passengerId === ride.creator,
            contactPhone:
              passengerId === ride.creator ? ride.contactPhone : undefined,
          })
        );
        setPassengers(fallbackPassengers);
        return;
      }

      // Map passengers data with creator flag
      const passengersInfo: PassengerInfo[] = data.map((passenger) => ({
        id: passenger.user_id,
        isCreator: passenger.user_id === ride.creator,
        contactPhone: passenger.contact_phone,
      }));

      setPassengers(passengersInfo);
    } catch (err) {
      console.error("Error fetching passenger details:", err);
      // Create fallback passenger data
      const fallbackPassengers: PassengerInfo[] = ride.passengers.map(
        (passengerId) => ({
          id: passengerId,
          isCreator: passengerId === ride.creator,
          contactPhone:
            passengerId === ride.creator ? ride.contactPhone : undefined,
        })
      );
      setPassengers(fallbackPassengers);
    }
  }, [ride.id, ride.passengers, ride.creator, ride.contactPhone]);

  // Fetch passengers when ride info changes
  useEffect(() => {
    if (ride.id) {
      fetchPassengersInfo();
    }
  }, [ride.id, fetchPassengersInfo]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    switch (ride.status) {
      case "open":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>
            Open
          </span>
        );
      case "full":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></span>
            Full
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
            Cancelled
          </span>
        );
    }
  };

  const handleJoinRideClick = () => {
    // Sync status before showing join modal
    syncRideStatus(ride.id).then(() => {
      setShowPhoneModal(true);
    });
  };

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setShowPhoneModal(false);
    try {
      // Sync status before joining
      await syncRideStatus(ride.id);
      await joinRideRequest(ride.id, phoneNumber);
      addNotification(
        `You have joined a ride to ${ride.destination.address}.`,
        "join",
        ride.id
      );
      toast.success("Successfully joined the ride");

      // Refresh the page to update ride data instead of redirecting to dashboard
      window.location.reload();
    } catch (error) {
      toast.error("Failed to join ride");
      console.error(error);
    }
  };

  const handleCancelRide = async () => {
    try {
      // Sync status before cancelling
      await syncRideStatus(ride.id);
      await cancelRideRequest(ride.id);
      addNotification(
        `You have cancelled your ride to ${ride.destination.address}.`,
        "update",
        ride.id
      );
      toast.success("Ride cancelled successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        "Failed to cancel ride. The ride might have already been completed."
      );
      console.error(error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      // Sync status before completing
      await syncRideStatus(ride.id);
      await completeRideRequest(ride.id);
      addNotification(
        `Your ride to ${ride.destination.address} has been completed.`,
        "update",
        ride.id
      );
      toast.success("Ride completed successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to complete ride");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ride #{ride.id.substring(0, 4)}
            </h2>
            <p className="text-gray-600 flex items-center mt-2">
              <Calendar className="h-5 w-5 mr-2" />
              Created on {formatDate(ride.createdAt)} at{" "}
              {formatTime(ride.createdAt)}
            </p>
          </div>
          <div className="mt-2 sm:mt-0">{getStatusBadge()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Ride Details
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      STARTING POINT
                    </p>
                    <p className="text-gray-800">
                      {ride.startingPoint.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <Navigation className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      DESTINATION
                    </p>
                    <p className="text-gray-800">{ride.destination.address}</p>
                  </div>
                </div>

                {/* Creator's phone number (if available) */}
                {ride.contactPhone && (
                  <div className="flex items-start mb-4">
                    <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        CREATOR'S CONTACT NUMBER
                      </p>
                      <p className="text-gray-800">{ride.contactPhone}</p>
                      {!isCreator && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Call this number to coordinate with the ride creator
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Try to find creator phone from passengers list if not available on ride object */}
                {!ride.contactPhone && passengers.length > 0 && (
                  <>
                    {passengers.find((p) => p.isCreator && p.contactPhone) && (
                      <div className="flex items-start mb-4">
                        <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            CREATOR'S CONTACT NUMBER
                          </p>
                          <p className="text-gray-800">
                            {passengers.find((p) => p.isCreator)?.contactPhone}
                          </p>
                          {!isCreator && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Call this number to coordinate with the ride
                              creator
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Passengers
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">
                      {ride.passengers.length}/{ride.totalSeats} passengers
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {ride.seatsAvailable} seats available
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        (ride.passengers.length / ride.totalSeats) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="space-y-3">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {passenger.isCreator
                            ? "Ride Creator"
                            : `Passenger ${index + 1}`}
                        </p>
                        {passenger.contactPhone &&
                          (isCreator || isPassenger) && (
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 text-gray-500 mr-1" />
                              <p className="text-xs text-gray-600">
                                {passenger.contactPhone}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Route Map
            </h3>
            <RideMap
              startingPoint={ride.startingPoint}
              destination={ride.destination}
              height="300px"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              {canJoin && (
                <button
                  onClick={handleJoinRideClick}
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Join This Ride
                </button>
              )}

              {canLeaveOrCancel && (
                <button
                  onClick={handleCancelRide}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {isCreator ? "Cancel Ride" : "Leave Ride"}
                </button>
              )}

              {canComplete && (
                <button
                  onClick={handleCompleteRide}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mark as Completed
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Instructions for Riders
          </h3>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-amber-800">
              <strong>Important:</strong> This app only helps you find
              co-passengers. Once your group is formed, you'll need to arrange
              for a rickshaw offline. We recommend meeting at the starting point
              10 minutes before your planned departure.
            </p>
          </div>
        </div>
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

export default RideDetail;
