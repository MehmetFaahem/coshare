import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";
import Logo from "/sohojatra.png";
import TermsModal from "../modals/TermsModal";
import PrivacyModal from "../modals/PrivacyModal";

const Footer: React.FC = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <footer className="bg-gradient-to-r from-accent-600 to-secondary-600 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <img
              src={Logo}
              alt="Sohojatra"
              className="w-[140px] sm:w-[160px] lg:w-[180px] mb-4"
            />
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-md">
              Connecting passengers to share rides and reduce transportation
              costs. Our platform makes sharing rides easy, environmentally
              friendly, and economical.
            </p>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg hover:translate-x-1 transform duration-200 inline-block"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Support & Legal</h3>
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <li>
                <Link
                  to="https://www.linkedin.com/in/muhammad-faahem/"
                  target="_blank"
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg hover:translate-x-1 transform duration-200 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg cursor-pointer hover:translate-x-1 transform duration-200 inline-block text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-white/80 hover:text-white transition-colors text-base sm:text-lg cursor-pointer hover:translate-x-1 transform duration-200 inline-block text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="https://github.com/MehmetFaahem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
                >
                  <Github size={20} className="sm:w-6 sm:h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammad-faahem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
                >
                  <Linkedin size={20} className="sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-white/70 text-sm sm:text-base lg:text-lg">
            &copy; {new Date().getFullYear()} Sohojatra. All rights reserved. Made with ❤️ for smarter commuting.
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
