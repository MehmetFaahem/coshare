import React from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { Link } from "react-router-dom";
import { Bell, CheckCircle, AlertCircle, Users, Info } from "lucide-react";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
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
        return <CheckCircle className="h-5 w-5 text-accent-500" />;
      case "update":
        return <Info className="h-5 w-5 text-secondary-500" />;
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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-large overflow-hidden z-20 border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
          <button
            onClick={markAllAsRead}
            disabled={!notifications.some((n) => !n.read)}
            className={`text-sm font-medium transition-colors ${
              notifications.some((n) => !n.read)
                ? "text-accent-600 hover:text-accent-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">We'll notify you when something important happens</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-accent-50 border-l-4 border-l-accent-500" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <p
                        className={`text-sm leading-relaxed ${
                          !notification.read ? "font-medium text-gray-900" : "text-gray-700"
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
                        className="mt-2 text-xs text-accent-600 hover:text-accent-700 font-medium"
                        onClick={onClose}
                      >
                        View ride details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
