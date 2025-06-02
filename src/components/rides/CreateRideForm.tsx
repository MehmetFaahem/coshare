import React, { useState } from "react";
import { useRide } from "../../contexts/RideContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Location } from "../../types";
import GlobalMap from "../map/GlobalMap";
import { useNotification } from "../../contexts/NotificationContext";
import PhoneNumberModal from "./PhoneNumberModal";
import { MapPin, Users, ArrowRight } from "lucide-react";

const CreateRideForm: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [totalSeats, setTotalSeats] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { createRideRequest } = useRide();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startingPoint || !destination) {
      toast.error("Please select both starting point and destination");
      return;
    }

    // Show phone number modal instead of submitting directly
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone);
    setShowPhoneModal(false);
    setIsSubmitting(true);

    try {
      const newRide = await createRideRequest(
        startingPoint!,
        destination!,
        totalSeats,
        phone
      );
      toast.success("Ride request created successfully!");
      addNotification(
        `Your ride request to ${destination!.address} has been created.`,
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
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white shadow-large rounded-3xl overflow-hidden border border-gray-100">
        <div className="p-8">
          

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <GlobalMap
                    startingPoint={startingPoint}
                    destination={destination}
                    onStartingPointChange={setStartingPoint}
                    onDestinationChange={setDestination}
                    height="400px"
                  />
                </div>

                {/* Seat Selection */}
                <div className="bg-accent-50 rounded-2xl p-6 border border-accent-200">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-accent-600 mr-3" />
                    <label className="text-lg font-semibold text-gray-900">
                      Total Seats (including you)
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[2, 3, 4, 5].map((seats) => (
                      <button
                        key={seats}
                        type="button"
                        onClick={() => setTotalSeats(seats)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          totalSeats === seats
                            ? "bg-accent-500 text-white shadow-medium transform scale-105"
                            : "bg-white text-accent-600 border-2 border-accent-200 hover:border-accent-400 hover:bg-accent-50"
                        }`}
                      >
                        {seats} seats
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-accent-700 bg-accent-100 p-3 rounded-xl">
                    💡 A standard ride can accommodate up to 5 passengers comfortably
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-modern w-full py-4 px-6 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-large disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  disabled={isSubmitting || !startingPoint || !destination}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Creating Ride...
                    </>
                  ) : (
                    <>
                      Create Ride Request
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Details Panel */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MapPin className="h-6 w-6 text-secondary-600 mr-3" />
                    Ride Summary
                  </h3>

                  {startingPoint ? (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Starting Point:
                      </p>
                      <p className="text-gray-900 font-medium">
                        {startingPoint.address}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 text-center">
                        📍 Select your starting point on the map
                      </p>
                    </div>
                  )}

                  {destination ? (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Destination:
                      </p>
                      <p className="text-gray-900 font-medium">
                        {destination.address}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 text-center">
                        🎯 Select your destination on the map
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Available Seats:
                    </p>
                    <p className="text-gray-900 font-medium">
                      {totalSeats} passengers total (including you)
                    </p>
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">
                    📚 Quick Guide
                  </h4>
                  <ul className="space-y-3 text-amber-700">
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      Use the search box to find locations quickly
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      Drag markers to adjust exact pickup points
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      Click anywhere on the map to set locations
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      Choose seat count based on ride capacity
                    </li>
                  </ul>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">
                    ℹ️ Important Notice
                  </h4>
                  <p className="text-blue-700">
                    This app helps you find co-passengers. You'll need to arrange for a ride offline once your group is formed. We recommend meeting at the starting point 10 minutes before departure.
                  </p>
                </div>
              </div>
            </div>
          </form>
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

export default CreateRideForm;
