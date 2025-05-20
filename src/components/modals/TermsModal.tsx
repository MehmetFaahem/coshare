import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-emerald-700 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Terms of Service</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">1. Introduction</h3>
          <p className="mb-4">
            Welcome to Sohojatra. These Terms of Service govern your use of our
            platform, website, and services. By accessing or using Sohojatra,
            you agree to be bound by these Terms.
          </p>

          <h3 className="text-lg font-semibold mb-4">2. Definitions</h3>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              "Sohojatra", "we", "us", or "our" refers to the Sohojatra
              platform.
            </li>
            <li className="mb-2">
              "User", "you", or "your" refers to individuals who use our
              services.
            </li>
            <li className="mb-2">
              "Service" refers to the rickshaw ride-sharing facilitation
              services provided by Sohojatra.
            </li>
            <li className="mb-2">
              "Ride" refers to a journey facilitated through our platform.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">
            3. Account Registration
          </h3>
          <p className="mb-4">
            To use certain features of our Service, you must register for an
            account. You agree to provide accurate information and keep your
            account details secure. You are responsible for all activities that
            occur under your account.
          </p>

          <h3 className="text-lg font-semibold mb-4">4. User Conduct</h3>
          <p className="mb-4">When using Sohojatra, you agree to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              Provide accurate information when creating or joining rides
            </li>
            <li className="mb-2">Arrive punctually for scheduled rides</li>
            <li className="mb-2">
              Treat other users with respect and courtesy
            </li>
            <li className="mb-2">Pay agreed amounts for rides promptly</li>
            <li className="mb-2">
              Not engage in any illegal or disruptive behavior during rides
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">5. Ride Sharing Terms</h3>
          <p className="mb-4">
            Sohojatra facilitates connections between users for shared rickshaw
            rides. We do not provide transportation services directly. Users
            agree that:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              Ride details (routes, times, costs) are agreed between
              participating users
            </li>
            <li className="mb-2">
              Payments for rides are handled directly between users
            </li>
            <li className="mb-2">
              Cancellations should be made with reasonable notice
            </li>
            <li className="mb-2">
              Sohojatra is not responsible for any disputes between users
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">
            6. Limitation of Liability
          </h3>
          <p className="mb-4">
            Sohojatra is a platform that connects riders and does not provide
            transportation services. We are not liable for:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              Safety or quality of rides arranged through our platform
            </li>
            <li className="mb-2">
              Personal injury or property damage during rides
            </li>
            <li className="mb-2">
              Disputes between users regarding payments or other matters
            </li>
            <li className="mb-2">
              Delays, cancellations, or other issues with arranged rides
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">
            7. Modifications to Terms
          </h3>
          <p className="mb-4">
            We may modify these Terms at any time. Continued use of Sohojatra
            after such modifications constitutes your acceptance of the revised
            Terms.
          </p>

          <h3 className="text-lg font-semibold mb-4">8. Termination</h3>
          <p className="mb-4">
            We reserve the right to suspend or terminate your access to
            Sohojatra at our discretion, particularly for violations of these
            Terms.
          </p>

          <h3 className="text-lg font-semibold mb-4">9. Governing Law</h3>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with
            the laws of Bangladesh, without regard to its conflict of law
            principles.
          </p>

          <p className="mt-6 text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
