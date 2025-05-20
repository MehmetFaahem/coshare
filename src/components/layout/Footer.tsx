import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "/sohojatra.png";
import TermsModal from "../modals/TermsModal";
import PrivacyModal from "../modals/PrivacyModal";

const Footer: React.FC = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <footer className="bg-emerald-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src={Logo}
              alt="Sohojatra"
              className="hidden md:block md:w-[150px]"
            />
            <p className="text-gray-300 text-sm">
              Connecting passengers to share rides and reduce transportation
              costs. Our platform makes sharing rickshaws easy, environmentally
              friendly, and economical.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/rides"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Find Rides
                </Link>
              </li>
              <li>
                <Link
                  to="/create-ride"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Create Ride
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="https://www.linkedin.com/in/muhammad-faahem/"
                  target="_blank"
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-gray-300 hover:text-emerald-400 transition-colors text-sm cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/MehmetFaahem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-faahem/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
            {/* <div className="mt-4">
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter
              </p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-sm bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Sohojatra. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modals */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
