import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ closeDropdown, notifications }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const handleViewAll = () => {
    closeDropdown();
    if (notifications && notifications.length > 0) {
      navigate('/dashboard/dashboard-notification', {
        state: { notifications },
      });
    } else {
      console.log('No project data available');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  return (
    <div
      ref={dropdownRef}
      className='absolute top-14 right-0 md:right-40 bg-white shadow-lg rounded-lg w-full md:max-w-md z-50'
    >
      <div className='flex flex-col h-full'>
        {/* Fixed Header */}
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-bold'>Notifications</h2>
          <button onClick={handleViewAll} className='text-blue-500 text-sm'>
            View all
          </button>
        </div>

        {/* Scrollable Content */}
        <div className='flex-grow overflow-y-auto max-h-96 mb-2'>
          <div className='p-4 space-y-6'>
            {notifications.length === 0 ? (
              <p className='text-sm text-gray-500'>No new notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div className='p-4 bg-gray-100 rounded-lg mb-4' key={index}>
                  <p className='text-sm text-gray-800 mb-1'>
                    <strong>{notification.sender}</strong>{' '}
                    {notification.message}
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
                      <button className='text-blue-500 text-sm'>
                        See more
                      </button>
                    )}
                  </div>
                  <p className='text-xs text-gray-400 mt-2'>
                    {notification.timeAgo}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
