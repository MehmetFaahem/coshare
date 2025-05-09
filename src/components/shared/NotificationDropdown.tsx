import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Users, Info } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMin = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMin < 1) return 'Just now';
    if (diffInMin < 60) return `${diffInMin}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'update':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'join':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-sm text-emerald-600 hover:text-emerald-800"
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-emerald-50' : ''
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
                          !notification.read ? 'font-medium' : 'text-gray-700'
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
                        className="mt-1 text-xs text-emerald-600 hover:text-emerald-800"
                        onClick={onClose}
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
      
      <div className="p-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;