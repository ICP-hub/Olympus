import React from 'react';
import { useLocation } from 'react-router-dom';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import mentor from '../../../../assets/Logo/talent.png'; // fallback image

export default function DashboardNotification() {
  const location = useLocation();
  const { notifications } = location.state || {};

  // Helper function to format timestamps into a "time ago" format
  const timestampAgo = (timestamp) => {
    const timestampAsNumber = Number(timestamp / 1_000_000n); // Assuming timestamp is in nanoseconds
    const now = Date.now();
    const timeDiff = Math.floor((now - timestampAsNumber) / 1000);

    if (timeDiff < 60) return `${timeDiff} seconds ago`;
    if (timeDiff < 3600) return `${Math.floor(timeDiff / 60)} minutes ago`;
    if (timeDiff < 86400) return `${Math.floor(timeDiff / 3600)} hours ago`;
    return `${Math.floor(timeDiff / 86400)} days ago`;
  };

  const formatNotificationMessage = (notification) => {
    const senderName = notification.sender_data.params.full_name;
    if (
      notification.notification_data &&
      notification.notification_data.cohort_noti.length > 0
    ) {
      return `${senderName} wants to join your cohort.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.docs_noti.length > 0
    ) {
      return `${senderName} wants to access your documents.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.association_noti.length > 0
    ) {
      return `${senderName} wants to associate with you.`;
    }
    if (
      notification.notification_data &&
      notification.notification_data.money_noti.length > 0
    ) {
      return `${senderName} is requesting access to fundraising information.`;
    }
    return 'You have a new notification.';
  };

  return (
    <div className='bg-white rounded-lg w-full h-full flex flex-col'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-3xl font-bold'>Notifications</h2>
      </div>

      <div className='flex-grow overflow-y-auto'>
        <div className='p-4 space-y-6'>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const profilePictureData =
                notification.sender_data.params.profile_picture;
              const profilePictureSrc =
                profilePictureData && profilePictureData.length > 0
                  ? uint8ArrayToBase64(profilePictureData[0])
                  : [];

              return (
                <div
                  className='flex items-start space-x-4 p-4 bg-gray-100 rounded-lg mb-4'
                  key={index}
                >
                  <img
                    src={profilePictureSrc}
                    alt='Notification sender avatar'
                    className='h-[40px] w-[40px] rounded-full'
                    loading='lazy'
                    draggable={false}
                  />
                  <div className='flex-1'>
                    <p className='text-sm text-gray-800 mb-1'>
                      {formatNotificationMessage(notification)}
                    </p>
                    <p className='text-xs text-gray-400 mt-2'>
                      {timestampAgo(notification.sent_at)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-sm text-gray-500'>No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
