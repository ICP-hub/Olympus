import React from 'react';
import { useLocation } from 'react-router-dom';

export default function DashboardNotification() {
  const location = useLocation();
  const { notifications } = location.state || {};

  return (
    <div className='bg-white rounded-lg w-full h-full flex flex-col'>
      {/* Fixed header */}
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-3xl font-bold'>Notifications</h2>
      </div>

      {/* Scrollable notification content */}
      <div className='flex-grow overflow-y-auto'>
        <div className='p-4 space-y-6'>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div className='p-4 bg-gray-100 rounded-lg mb-4' key={index}>
                <p className='text-sm text-gray-800 mb-1'>
                  <strong>{notification.sender}</strong> {notification.message}
                </p>

                {/* Extra Content based on the notification type */}
                {notification.extra && (
                  <div className='border border-gray-300 rounded-lg p-2 mb-3 bg-white'>
                    {notification.extra.type === 'text' ? (
                      <p className='text-sm'>{notification.extra.content}</p>
                    ) : (
                      <p className='text-sm font-semibold'>
                        {notification.extra.content}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className='flex space-x-2 mt-2'>
                  {notification.accept && (
                    <button className='bg-blue-500 text-white px-3 py-1 rounded-md text-sm'>
                      Accept
                    </button>
                  )}
                  {notification.decline && (
                    <button className='bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm'>
                      Decline
                    </button>
                  )}
                  {notification.seeMore && (
                    <button className='text-blue-500 text-sm'>See more</button>
                  )}
                </div>
                <p className='text-xs text-gray-400 mt-2'>
                  {notification.timeAgo}
                </p>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500'>No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
