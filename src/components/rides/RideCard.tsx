import React from "react";
import { RideRequest } from "../../types";
import { MapPin, Navigation, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
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

  const isCreator = user && ride.creator === user.id;
  const isPassenger = user && ride.passengers.includes(user.id);
  const canJoin =
    user && !isPassenger && ride.status === "open" && ride.seatsAvailable > 0;
  const canLeaveOrCancel =
    isPassenger && ride.status !== "completed" && ride.status !== "cancelled";
  const canComplete =
    isCreator && ride.status !== "completed" && ride.status !== "cancelled";

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>
            Open
          </span>
        );
      case "full":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
            Full
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
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
          {getStatusBadge()}
        </div>

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

        <div className="flex flex-wrap gap-2 mt-4">
          {canJoin && onJoin && (
            <Link to={`/rides/${ride.id}`}>
              <button
                onClick={() => {
                  onJoin(ride.id);
                  // Scroll to the top of the page
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Join Ride
              </button>
            </Link>
          )}

          {canLeaveOrCancel && onCancel && (
            <button
              onClick={() => {
                onCancel(ride.id);
                // Scroll to the top of the page
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {isCreator ? "Cancel Ride" : "Leave Ride"}
            </button>
          )}

          {canComplete && onComplete && (
            <button
              onClick={() => {
                onComplete(ride.id);
                // Scroll to the top of the page
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Complete Ride
            </button>
          )}

          <Link
            to={`/rides/${ride.id}`}
            onClick={() => {
              // Scroll to the top of the page
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
