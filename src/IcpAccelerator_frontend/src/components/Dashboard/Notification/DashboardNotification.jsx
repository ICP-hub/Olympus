import React from 'react';
import { useLocation } from 'react-router-dom';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import mentor from '../../../../assets/Logo/talent.png'; // fallback image
import DocsNotification from './DocsNotification';

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

  //   const formatNotificationMessage = (notification) => {
  //     const senderName = notification?.sender_data?.params?.full_name;
  //     const senderProfilePicture =notification?.sender_data?.params?.profile_picture && notification?.sender_data?.params?.profile_picture?.[0]?uint8ArrayToBase64(notification?.sender_data?.params?.profile_picture?.[0]):''
  //     const receiverName = notification?.receiver_data?.params?.full_name;
  //     const receiverProfilePicture =notification?.receiver_data?.params?.profile_picture && notification?.receiver_data?.params?.profile_picture?.[0]?uint8ArrayToBase64(notification?.receiver_data?.params?.profile_picture?.[0]):''

  //     const notificationData = notification.notification_data;

  //     if (!notificationData) return { message: 'You have a new notification.', type: 'default' };

  //     if (notificationData.docs_noti && notificationData.docs_noti.length > 0) {
  //       const docsStatus = notificationData.docs_noti[0].status;

  //       return {
  //           message,
  //           type: 'docs_noti',
  //           details: {
  //               status: docsStatus,
  //               document_name: notificationData.docs_noti[0].document_name,
  //               project_name: notificationData.docs_noti[0].project_name,
  //               message: notificationData.docs_noti[0].message,
  //               id: notificationData.docs_noti[0].id,
  //               sender: {
  //                   name: senderName,
  //                   profilePicture: senderProfilePicture,
  //               },
  //               receiver: {
  //                   name: receiverName,
  //                   profilePicture: receiverProfilePicture,
  //               }
  //           }
  //       };
  //   }

  //     // Cohort Notification
  //     if (notificationData.cohort_noti && notificationData.cohort_noti.length > 0) {
  //         return {
  //             message: `${senderName} wants to join your cohort.`,
  //             type: 'cohort_noti',
  //             details: {
  //                 cohort_name: notificationData.cohort_noti[0].cohort_name,
  //                 message: notificationData.cohort_noti[0].message,
  //                 id: notificationData.cohort_noti[0].id
  //             }
  //         };
  //     }

  //     // Association Notification
  //     if (notificationData.association_noti && notificationData.association_noti.length > 0) {
  //         return {
  //             message: `${senderName} wants to associate with you.`,
  //             type: 'association_noti',
  //             details: {
  //                 association_name: notificationData.association_noti[0].association_name,
  //                 message: notificationData.association_noti[0].message,
  //                 id: notificationData.association_noti[0].id
  //             }
  //         };
  //     }

  //     // Money Notification
  //     if (notificationData.money_noti && notificationData.money_noti.length > 0) {
  //         const moneyStatus = notificationData.money_noti[0].status;
  //         return {
  //             message: `${senderName} is requesting access to fundraising information.`,
  //             type: 'money_noti',
  //             details: {
  //                 status: moneyStatus,
  //                 fundraising_goal: notificationData.money_noti[0].fundraising_goal,
  //                 project_name: notificationData.money_noti[0].project_name,
  //                 id: notificationData.money_noti[0].id
  //             }
  //         };
  //     }

  //     // Default Notification
  //     return { message: 'You have a new notification.', type: 'default' };
  // };

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
                <></>
                // <DocsNotification key={index} formatNotificationMessage={formatNotificationMessage}/>
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
