"use client"

import { useState, useEffect } from "react";
import api from "@/constants/api"; // Adjust path based on your project structure

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await api.get("/brand/notifications");
        console.log(response.data)
        console.log("Notifications:", response.data);
        
        // Sort notifications: unread first, then by time (newest first)
        const sortedNotifications = response.data.data.sort((a, b) => {
          if (a.status === 'unread' && b.status === 'read') return -1;
          if (a.status === 'read' && b.status === 'unread') return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setNotifications(sortedNotifications);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Find notification index
      const index = notifications.findIndex(n => n.notification_id === notificationId);
      if (index === -1) return;

      // Create a copy of notifications array
      const updatedNotifications = [...notifications];
      
      // Update the status locally for immediate UI feedback
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        status: 'read'
      };

      // Update state immediately for responsive UI
      setNotifications(updatedNotifications);
      
      // Make API call to update in the backend
      await api.patch(`/brand/notifications/${notificationId}/read`);
      
      // Re-sort notifications (unread first, then by date)
      const sortedNotifications = [...updatedNotifications].sort((a, b) => {
        if (a.status === 'unread' && b.status === 'read') return -1;
        if (a.status === 'read' && b.status === 'unread') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setNotifications(sortedNotifications);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Refresh notifications to get the correct state
      const response = await api.get("/brand/notifications");
      if (response.data) {
        setNotifications(response.data);
      }
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-300"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="bg-red-50 border-l-4 border-red-300 p-4 rounded shadow">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-600">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-yellow-50 rounded-lg shadow-md p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-600 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Your Notifications
        </h2>
        {notifications.length > 0 && (
          <div className="bg-purple-100 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-200">
            {notifications.filter(n => n.status === 'unread').length} Unread
          </div>
        )}
      </div>
      
      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-gray-500">You have no notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div 
              key={notification.notification_id} 
              className={`py-4 px-5 rounded-lg shadow-sm border ${
                notification.status === 'unread' 
                  ? 'bg-white border-l-4 border-l-yellow-300 border-t-purple-100 border-r-purple-100 border-b-purple-100' 
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-start">
                {/* Notification dot/icon */}
                {notification.status === 'unread' && (
                  <div className="mt-1 mr-3 flex-shrink-0">
                    <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                  </div>
                )}
                
                {/* Notification content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${notification.status === 'unread' ? 'font-medium text-gray-800' : 'text-gray-700'}`}>
                      {notification.notification}
                    </p>
                    {notification.status === 'unread' && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.notification_id)}
                        className="ml-3 flex-shrink-0 text-purple-600 hover:text-purple-800 text-xs font-medium bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors border border-purple-200"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatTimestamp(notification.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination or load more button (if needed) */}
      {notifications.length > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100 hover:shadow transition-all">
            <span>Load more</span>
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}