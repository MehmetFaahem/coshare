import React, { useCallback } from "react";
import { RideRequest } from "../../types";
import { MapPin, Navigation, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RideCardProps {
  ride: RideRequest;
  onJoin?: (rideId: string) => void;
  onCancel?: (rideId: string) => void;
  onComplete?: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  onJoin,
  onCancel,
  onComplete,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // User permissions
  const isCreator = user && ride.creator === user.id;
  const isPassenger = user && ride.passengers.includes(user.id);
  const canJoin =
    user && !isPassenger && ride.status === "open" && ride.seatsAvailable > 0;
  const canLeaveOrCancel =
    isPassenger && ride.status !== "completed" && ride.status !== "cancelled";
  const canComplete =
    isCreator && ride.status !== "completed" && ride.status !== "cancelled";

  // Action handlers - using useCallback to prevent unnecessary re-renders
  const handleAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case "join":
          if (onJoin) onJoin(ride.id);
          break;
        case "cancel":
          if (onCancel) onCancel(ride.id);
          break;
        case "complete":
          if (onComplete) onComplete(ride.id);
          break;
        case "view":
          navigate(`/rides/${ride.id}`);
          break;
        default:
          break;
      }
      // Scroll to top after any action
      window.scrollTo(0, 0);
    },
    [ride.id, onJoin, onCancel, onComplete, navigate]
  );

  // Formatting helpers
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

  // Status badge renderer
  const renderStatusBadge = () => {
    const statusConfig = {
      open: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        dot: "bg-emerald-500",
        label: "Open",
      },
      full: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        dot: "bg-amber-500",
        label: "Full",
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        dot: "bg-blue-500",
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        dot: "bg-red-500",
        label: "Cancelled",
      },
    };

    const config = statusConfig[ride.status];
    if (!config) return null;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${config.dot} mr-1`}></span>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ride #{ride.id.substring(0, 4)}
            </h3>
            <p className="text-gray-600 text-sm flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(ride.createdAt)} at {formatTime(ride.createdAt)}
            </p>
          </div>
          {renderStatusBadge()}
        </div>

        {/* Ride info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">FROM</p>
                <p className="text-sm text-gray-800">
                  {ride.startingPoint.address}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Navigation className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">TO</p>
                <p className="text-sm text-gray-800">
                  {ride.destination.address}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    {ride.passengers.length}/{ride.totalSeats} passengers
                  </span>
                  <span className="text-xs text-gray-500">
                    {ride.seatsAvailable} seats available
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        (ride.passengers.length / ride.totalSeats) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {canJoin && onJoin && (
            <button
              type="button"
              onClick={() => handleAction("join")}
              className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Join Ride
            </button>
          )}

          {canLeaveOrCancel && onCancel && (
            <button
              type="button"
              onClick={() => handleAction("cancel")}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {isCreator ? "Cancel Ride" : "Leave Ride"}
            </button>
          )}

          {canComplete && onComplete && (
            <button
              type="button"
              onClick={() => handleAction("complete")}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Ride
            </button>
          )}

          <button
            type="button"
            onClick={() => handleAction("view")}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
