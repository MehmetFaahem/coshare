import React from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-emerald-700 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">1. Introduction</h3>
          <p className="mb-4">
            At Sohojatra, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our platform. By using Sohojatra, you consent to the
            data practices described in this policy.
          </p>

          <h3 className="text-lg font-semibold mb-4">
            2. Information We Collect
          </h3>
          <p className="mb-2">
            We may collect the following types of information:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong>Personal Information:</strong> Name, email address, phone
              number, profile picture
            </li>
            <li className="mb-2">
              <strong>Location Information:</strong> Your current location,
              travel routes, and destinations
            </li>
            <li className="mb-2">
              <strong>Usage Information:</strong> How you interact with our
              platform, frequency of use, ride history
            </li>
            <li className="mb-2">
              <strong>Device Information:</strong> Device type, operating
              system, browser type
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">
            3. How We Use Your Information
          </h3>
          <p className="mb-2">We use your information to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">Facilitate ride-sharing between users</li>
            <li className="mb-2">
              Match you with compatible ride partners based on routes and
              schedules
            </li>
            <li className="mb-2">Improve our services and user experience</li>
            <li className="mb-2">
              Communicate important updates and information about your rides
            </li>
            <li className="mb-2">
              Ensure the security and integrity of our platform
            </li>
            <li className="mb-2">
              Analyze usage patterns to enhance our service
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">4. Information Sharing</h3>
          <p className="mb-4">
            We share limited personal information with other users only as
            necessary to facilitate ride-sharing. This typically includes:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">Your name and profile picture</li>
            <li className="mb-2">Your intended travel route and schedule</li>
            <li className="mb-2">
              Contact information (when a ride is confirmed)
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">5. Data Security</h3>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction. However, no internet-based service can guarantee
            absolute security, so we encourage users to take precautions with
            their personal information.
          </p>

          <h3 className="text-lg font-semibold mb-4">6. Your Rights</h3>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">Access your personal information</li>
            <li className="mb-2">Correct inaccurate information</li>
            <li className="mb-2">Delete your account and associated data</li>
            <li className="mb-2">Opt out of marketing communications</li>
            <li className="mb-2">Request a copy of your data</li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">
            7. Cookies and Tracking Technologies
          </h3>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience,
            analyze usage patterns, and manage the site. You can control cookie
            settings through your browser preferences.
          </p>

          <h3 className="text-lg font-semibold mb-4">
            8. Changes to This Policy
          </h3>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by posting a notice on our website or
            sending you an email notification.
          </p>

          <h3 className="text-lg font-semibold mb-4">9. Contact Information</h3>
          <p className="mb-4">
            If you have questions about this Privacy Policy or our data
            practices, please contact us at privacy@sohojatra.com.
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

export default PrivacyModal;
