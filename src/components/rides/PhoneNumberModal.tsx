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

    onSubmit(phoneNumber);
    setPhoneNumber("");
    setError("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Information">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Please provide a phone number where passengers can reach you during
            the ride.
          </p>

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-500" />
            </div>
            <input
              id="phoneNumber"
              type="tel"
              className={`w-full pl-10 pr-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="+123 456 7890"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          <p className="mt-2 text-xs text-gray-500">
            This number will be shared with passengers who join your ride
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PhoneNumberModal;
