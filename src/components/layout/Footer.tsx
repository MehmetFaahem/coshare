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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img
              src={Logo}
              alt="Sohojatra"
              className="hidden md:block md:w-[180px] mb-4"
            />
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Connecting passengers to share rides and reduce transportation
              costs. Our platform makes sharing rides easy, environmentally
              friendly, and economical.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/80 hover:text-white transition-colors text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-lg hover:translate-x-1 transform duration-200 inline-block"
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
                  className="text-white/80 hover:text-white transition-colors text-lg hover:translate-x-1 transform duration-200 inline-block"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Support & Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="https://www.linkedin.com/in/muhammad-faahem/"
                  target="_blank"
                  className="text-white/80 hover:text-white transition-colors text-lg hover:translate-x-1 transform duration-200 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-white/80 hover:text-white transition-colors text-lg cursor-pointer hover:translate-x-1 transform duration-200 inline-block"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-white/80 hover:text-white transition-colors text-lg cursor-pointer hover:translate-x-1 transform duration-200 inline-block"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/MehmetFaahem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammad-faahem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70 text-lg">
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
