import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-large">
        <div className="sticky top-0 bg-gradient-to-r from-accent-500 to-accent-600 text-white py-6 px-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Terms of Service</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">1. Introduction</h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Welcome to Sohojatra. These Terms of Service govern your use of our
            platform, website, and services. By accessing or using Sohojatra,
            you agree to be bound by these Terms.
          </p>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">2. Definitions</h3>
          <ul className="list-disc ml-8 mb-6 space-y-3 text-lg text-gray-700">
            <li>
              "Sohojatra", "we", "us", or "our" refers to the Sohojatra
              platform.
            </li>
            <li>
              "User", "you", or "your" refers to individuals who use our
              services.
            </li>
            <li>
              "Service" refers to the ride ride-sharing facilitation
              services provided by Sohojatra.
            </li>
            <li>
              "Ride" refers to a journey facilitated through our platform.
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            3. Account Registration
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            To use certain features of our Service, you must register for an
            account. You agree to provide accurate information and keep your
            account details secure. You are responsible for all activities that
            occur under your account.
          </p>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">4. User Conduct</h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">When using Sohojatra, you agree to:</p>
          <ul className="list-disc ml-8 mb-6 space-y-3 text-lg text-gray-700">
            <li>Provide accurate information when creating or joining rides</li>
            <li>Arrive punctually for scheduled rides</li>
            <li>Treat other users with respect and courtesy</li>
            <li>Pay agreed amounts for rides promptly</li>
            <li>Not engage in any illegal or disruptive behavior during rides</li>
          </ul>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">5. Ride Sharing Terms</h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Sohojatra facilitates connections between users for shared ride
            rides. We do not provide transportation services directly. Users
            agree that:
          </p>
          <ul className="list-disc ml-8 mb-6 space-y-3 text-lg text-gray-700">
            <li>Ride details (routes, times, costs) are agreed between participating users</li>
            <li>Payments for rides are handled directly between users</li>
            <li>Cancellations should be made with reasonable notice</li>
            <li>Sohojatra is not responsible for any disputes between users</li>
          </ul>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            6. Limitation of Liability
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Sohojatra is a platform that connects riders and does not provide
            transportation services. We are not liable for:
          </p>
          <ul className="list-disc ml-8 mb-6 space-y-3 text-lg text-gray-700">
            <li>Safety or quality of rides arranged through our platform</li>
            <li>Personal injury or property damage during rides</li>
            <li>Disputes between users regarding payments or other matters</li>
            <li>Delays, cancellations, or other issues with arranged rides</li>
          </ul>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">
            7. Modifications to Terms
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            We may modify these Terms at any time. Continued use of Sohojatra
            after such modifications constitutes your acceptance of the revised
            Terms.
          </p>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">8. Termination</h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            We reserve the right to suspend or terminate your access to
            Sohojatra at our discretion, particularly for violations of these
            Terms.
          </p>

          <h3 className="text-2xl font-bold mb-6 text-gray-900">9. Governing Law</h3>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            These Terms shall be governed by and construed in accordance with
            the laws of Bangladesh, without regard to its conflict of law
            principles.
          </p>

          <p className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
