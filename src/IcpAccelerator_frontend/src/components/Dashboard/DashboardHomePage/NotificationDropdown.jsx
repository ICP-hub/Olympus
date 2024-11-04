import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mentor from '../../../../assets/Logo/talent.png';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';

const NotificationDropdown = ({ closeDropdown, notifications }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleViewAll = () => {
    closeDropdown();
    const notificationArray = notifications.Ok || [];
    if (Array.isArray(notificationArray) && notificationArray.length > 0) {
      navigate('/dashboard/dashboard-notification', {
        state: { notifications: notificationArray },
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

  const timestampAgo = (timestamp) => {
    // Convert BigInt timestamp to a valid number (milliseconds)
    const timestampAsNumber = Number(timestamp / 1_000_000n); // assuming timestamp is in nanoseconds
    const now = Date.now();
    const timeDiff = Math.floor((now - timestampAsNumber) / 1000);

    if (timeDiff < 60) return `${timeDiff} seconds ago`;
    if (timeDiff < 3600) return `${Math.floor(timeDiff / 60)} minutes ago`;
    if (timeDiff < 86400) return `${Math.floor(timeDiff / 3600)} hours ago`;
    return `${Math.floor(timeDiff / 86400)} days ago`;
  };

  const formatNotificationMessage = (notification) => {
    const sendername = notification.sender_data.params.full_name;
    if (
      notification.notification_data &&
      notification.notification_data.cohort_noti.length > 0
    ) {
      return `${sendername} wants to join your cohort.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.docs_noti.length > 0
    ) {
      return `${sendername} wants to access your documents.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.association_noti.length > 0
    ) {
      return `${sendername} wants to associate with you.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.money_noti.length > 0
    ) {
      return `${sendername} is requesting access to fundraising information.`;
    }
    return 'You have a new notification.';
  };

  const notificationArray = notifications.Ok || [];

  return (
    <div
      ref={dropdownRef}
      className='absolute top-14 right-0 md:right-40 bg-white shadow-lg rounded-lg w-full md:max-w-md z-50'
    >
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-bold'>Notifications</h2>
          <button onClick={handleViewAll} className='text-blue-500 text-sm'>
            View all
          </button>
        </div>

        <div className='flex-grow overflow-y-auto max-h-96 mb-2'>
          <div className='p-4 space-y-6'>
            {Array.isArray(notificationArray) &&
            notificationArray.length === 0 ? (
              <p className='text-sm text-gray-500'>
                No notifications found for this principal
              </p>
            ) : (
              notificationArray.map((notification, index) => {
                // Define the ProfilePicture for each notification
                const profilePictureData =
                  notification.sender_data.params.profile_picture;
                const ProfilePicture =
                  profilePictureData && profilePictureData.length > 0
                    ? uint8ArrayToBase64(profilePictureData[0])
                    : [];

                return (
                  <div
                    className='flex items-start space-x-4 p-4 bg-gray-100 rounded-lg mb-4'
                    key={index}
                  >
                    <img
                      src={ProfilePicture}
                      alt='Notification sender avatar'
                      className='h-[30px] w-[30px] rounded-full'
                      loading='lazy'
                      draggable={false}
                    />
                    <div className='flex-1'>
                      <p className='text-sm text-gray-800 mb-1'>
                        {formatNotificationMessage(notification)}
                      </p>
                      <p className='text-xs text-gray-400 mt-2'>
                        {timestampAgo(notification.sent_at) || 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
