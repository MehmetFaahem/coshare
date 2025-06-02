import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  CheckCircle,
  Info,
  Users,
} from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";
import NotificationDropdown from "../shared/NotificationDropdown";
import Logo from "/sohojatra.png";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={Logo}
                alt="Sohojatra"
                className="w-[120px] md:w-[150px]"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/rides"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-all duration-200"
                >
                  Find Rides
                </Link>
                <Link
                  to="/create-ride"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-all duration-200"
                >
                  Create Ride
                </Link>

                {/* Notification button */}
                <div className="ml-3 relative">
                  <button
                    className="p-3 rounded-xl text-gray-500 hover:text-accent-600 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 relative transition-all duration-200"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
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

                {/* Profile section */}
                <div className="ml-4 flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <button
                    className="p-2 rounded-xl text-gray-500 hover:text-accent-600 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-accent-600 rounded-xl hover:bg-accent-50 transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="ml-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 rounded-xl shadow-medium hover:shadow-large transition-all duration-200 transform hover:scale-105"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu and notification buttons */}
          <div className="flex items-center sm:hidden space-x-2">
            {user && (
              <button
                type="button"
                className="p-3 rounded-xl text-gray-500 hover:text-accent-600 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 relative transition-all duration-200"
                onClick={() => setIsNotificationDrawerOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              className="p-3 rounded-xl text-gray-500 hover:text-accent-600 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-5 w-5" />
              ) : (
                <Menu className="block h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Modern design */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-medium">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/rides"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Rides
                </Link>
                <Link
                  to="/create-ride"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Ride
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsNotificationDrawerOpen(true);
                  }}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-3 flex items-center bg-gray-50 rounded-xl mb-2">
                    <User className="h-6 w-6 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent-600 hover:bg-accent-50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 rounded-xl transition-all duration-200 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile notification drawer - same as before but with updated styling */}
      {isNotificationDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setIsNotificationDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-large transform transition-transform duration-300 z-50 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Notifications
              </h3>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-accent-600 hover:bg-accent-50 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NotificationList />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Notification list component with updated styling
const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMin = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMin < 1) return "Just now";
    if (diffInMin < 60) return `${diffInMin}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "update":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "join":
        return <Users className="h-5 w-5 text-purple-500" />;
      case "leave":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-amber-500"
          >
            <path d="M14 8v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
            <path d="M9 12h12l-3-3" />
            <path d="M18 15l3-3" />
          </svg>
        );
      case "system":
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={markAllAsRead}
          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-accent-50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <p
                        className={`text-sm ${
                          !notification.read ? "font-medium" : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    {notification.rideId && (
                      <Link
                        to={`/rides/${notification.rideId}`}
                        className="mt-1 text-xs text-accent-600 hover:text-accent-700"
                      >
                        View ride details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
