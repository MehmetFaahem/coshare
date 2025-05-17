import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Menu, X, User, LogOut } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";
import NotificationDropdown from "../shared/NotificationDropdown";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                className="text-emerald-600 fill-current mr-2"
              >
                <path d="M5.5 21C4.72 21 4.04 20.58 3.71 19.9L2.1 16.44C1.61 15.38 1.95 14.14 2.9 13.5L4.33 12.58C4.09 11.76 3.97 10.9 3.97 10.01C3.97 9.12 4.09 8.26 4.33 7.44L2.9 6.52C1.95 5.88 1.61 4.64 2.1 3.58L3.71 0.11C4.04 -0.57 4.72 -0.99 5.5 -0.99C6.56 -0.99 8.22 -0.99 9.17 -0.99C9.44 -0.99 9.71 -0.89 9.93 -0.7C12.4 1.48 13.97 5.55 13.97 10.01C13.97 14.47 12.4 18.54 9.93 20.72C9.71 20.91 9.44 21.01 9.17 21.01C8.22 21.01 6.56 21.01 5.5 21.01V21ZM19.83 17.01H15.83V15.01H19.83C20.93 15.01 21.83 14.11 21.83 13.01C21.83 11.91 20.93 11.01 19.83 11.01H18.33V20.96C18.33 21.54 17.87 22.01 17.29 22C16.71 21.99 16.26 21.52 16.27 20.94L16.33 7.01H19.83C22.14 7.01 24 8.87 24 11.18V11.18C24 13.83 22.28 16.06 19.83 17.01Z" />
              </svg>
              <span className="font-bold text-lg text-gray-800">Sohojatra</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-md text-sm font-medium">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
                <div className="px-3 py-2 rounded-md text-sm font-medium">
                  <Link
                    to="/rides"
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Find Rides
                  </Link>
                </div>
                <div className="px-3 py-2 rounded-md text-sm font-medium">
                  <Link
                    to="/create-ride"
                    className="text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Create Ride
                  </Link>
                </div>

                {/* Notification button */}
                <div className="ml-3 relative">
                  <button
                    className="p-1 rounded-full text-gray-500 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 relative"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <NotificationDropdown
                      onClose={() => setIsNotificationOpen(false)}
                    />
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="ml-4 relative flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <button
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 text-gray-500 hover:text-emerald-600" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="ml-3 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/rides"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Rides
                </Link>
                <Link
                  to="/create-ride"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Ride
                </Link>
                <div className="px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsNotificationOpen(true);
                    }}
                    className="flex items-center w-full text-left"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2 flex items-center">
                    <User className="h-6 w-6 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
