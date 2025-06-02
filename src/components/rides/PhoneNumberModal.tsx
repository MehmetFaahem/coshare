import React, { useState } from "react";
import Modal from "../shared/Modal";
import { Phone } from "lucide-react";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    // Simple phone number format validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s|-/g, ""))) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    onSubmit(phoneNumber);
    setPhoneNumber("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Information">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
            Your Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>📱 Why we need this:</strong> Your phone number will be shared with other passengers once they join your ride, making it easy to coordinate meeting points and timing.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-medium focus:outline-none focus:ring-2 focus:ring-accent-400"
          >
            Create Ride
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PhoneNumberModal;
