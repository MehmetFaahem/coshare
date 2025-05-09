import React, { useState } from "react";
import { useRide } from "../../contexts/RideContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Location } from "../../types";
import GlobalMap from "../map/GlobalMap";
import { useNotification } from "../../contexts/NotificationContext";

const CreateRideForm: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [totalSeats, setTotalSeats] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createRideRequest } = useRide();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startingPoint || !destination) {
      toast.error("Please select both starting point and destination");
      return;
    }

    setIsSubmitting(true);

    try {
      const newRide = await createRideRequest(
        startingPoint,
        destination,
        totalSeats
      );
      toast.success("Ride request created successfully!");
      addNotification(
        `Your ride request to ${destination.address} has been created.`,
        "system",
        newRide.id
      );
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create ride request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Create a New Ride Request
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <GlobalMap
                  startingPoint={startingPoint}
                  destination={destination}
                  onStartingPointChange={setStartingPoint}
                  onDestinationChange={setDestination}
                  height="350px"
                />

                <div className="mt-6 mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Total Seats (including you)
                  </label>
                  <div className="flex items-center space-x-2">
                    {[2, 3, 4, 5].map((seats) => (
                      <button
                        key={seats}
                        type="button"
                        className={`flex-1 py-2 px-4 border ${
                          totalSeats === seats
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } rounded-md transition-colors focus:outline-none`}
                        onClick={() => setTotalSeats(seats)}
                      >
                        {seats}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    A standard rickshaw can accommodate up to 5 passengers.
                  </p>
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70"
                    disabled={isSubmitting || !startingPoint || !destination}
                  >
                    {isSubmitting ? "Creating Ride..." : "Create Ride Request"}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Ride Details</h3>

                {startingPoint && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Starting Point:
                    </p>
                    <p className="text-sm text-gray-600">
                      {startingPoint.address}
                    </p>
                  </div>
                )}

                {destination && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Destination:
                    </p>
                    <p className="text-sm text-gray-600">
                      {destination.address}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    Seats Available:
                  </p>
                  <p className="text-sm text-gray-600">
                    {totalSeats} (including you)
                  </p>
                </div>

                <div className="text-sm text-gray-500 mt-6">
                  <p>Need help?</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Use the search box to find a location</li>
                    <li>Drag markers to refine exact positions</li>
                    <li>Click anywhere on the map to set a location</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRideForm;
