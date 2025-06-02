import React, { useCallback } from "react";
import { RideRequest } from "../../types";
import { MapPin, Navigation, Users, Calendar, Clock } from "lucide-react";
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

  const handleAction = useCallback(
    (action: "join" | "cancel" | "complete" | "view") => {
      switch (action) {
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
      }
    },
    [ride.id, onJoin, onCancel, onComplete, navigate]
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      open: "bg-green-100 text-green-800 border-green-200",
      full: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    
    const statusText = {
      open: "Open",
      full: "Full",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badges[status as keyof typeof badges] || badges.open}`}>
        {statusText[status as keyof typeof statusText] || "Unknown"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card-hover bg-white rounded-2xl shadow-soft hover:shadow-medium border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isCreator ? "Your Ride" : "Available Ride"}
              </h3>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(ride.createdAt)}
              </div>
            </div>
          </div>
          {getStatusBadge(ride.status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Route Information */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">From</p>
              <p className="text-sm text-gray-900 font-medium truncate">
                {ride.startingPoint.address}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">To</p>
              <p className="text-sm text-gray-900 font-medium truncate">
                {ride.destination.address}
              </p>
            </div>
          </div>
        </div>

        {/* Seats Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Seats</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {ride.seatsAvailable}/{ride.totalSeats}
              </span>
              <p className="text-xs text-gray-500">available</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {canJoin && onJoin && (
            <button
              type="button"
              onClick={() => handleAction("join")}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-medium"
            >
              Join Ride
            </button>
          )}

          {canLeaveOrCancel && onCancel && (
            <button
              type="button"
              onClick={() => handleAction("cancel")}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              {isCreator ? "Cancel Ride" : "Leave Ride"}
            </button>
          )}

          {canComplete && onComplete && (
            <button
              type="button"
              onClick={() => handleAction("complete")}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-medium"
            >
              Complete Ride
            </button>
          )}

          <button
            type="button"
            onClick={() => handleAction("view")}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 hover:border-accent-300 hover:bg-accent-50 text-gray-700 hover:text-accent-700 text-sm font-semibold rounded-xl transition-all duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
