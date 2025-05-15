// src/components/dashboard/NotificationFeed.tsx
import React, { useState } from 'react';
import { ArrowRight, Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
}

interface NotificationFeedProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
  onViewAll?: () => void;
}

const NotificationFeed: React.FC<NotificationFeedProps> = ({ 
  notifications, 
  onMarkAsRead,
  onViewAll 
}) => {
  const [expandedNotification, setExpandedNotification] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedNotification(expandedNotification === id ? null : id);
    if (!notifications.find(n => n.id === id)?.isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Bell className="mr-2 text-blue-500" />
        Notifications
        {notifications.some(n => !n.isRead) && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </h3>
      
      {notifications.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p>No notifications at this time</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 5).map(notification => (
            <li 
              key={notification.id} 
              className={`rounded-lg border ${notification.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
            >
              <div 
                className="p-3 flex items-start cursor-pointer"
                onClick={() => toggleExpand(notification.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-800'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  {expandedNotification === notification.id ? (
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  ) : (
                    <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {notifications.length > 0 && (
        <button 
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={onViewAll}
        >
          View all notifications <ArrowRight size={16} className="ml-1" />
        </button>
      )}
    </div>
  );
};

export default NotificationFeed;