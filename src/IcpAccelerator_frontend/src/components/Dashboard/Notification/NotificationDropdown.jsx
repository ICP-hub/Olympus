import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mentor from '../../../../assets/Logo/talent.png';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import DocsNotification from './DocsNotification';
import MoneyRaiseNotification from './MoneyRaiseNotification';

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

  const renderNotification = (notification) => {
    const { docs_noti, cohort_noti, association_noti, money_noti } =
      notification.notification_data || {};

    if (docs_noti && docs_noti[0].length > 0) {
      return (
        <DocsNotification
          notification={notification}
          formatNotificationMessage={formatNotificationMessage}
        />
      );
    }

    if (cohort_noti && cohort_noti[0].length > 0) {
      // Replace the commented line with your CohortNotification component when ready
      // <CohortNotification key={notification.sent_at} notification={notification} formatNotificationMessage={formatNotificationMessage} />
      return (
        <p key={notification.sent_at}>
          Cohort notification component goes here.
        </p>
      );
    }

    if (association_noti && association_noti[0].length > 0) {
      // Replace the commented line with your AssociationNotification component when ready
      // <AssociationNotification key={notification.sent_at} notification={notification} formatNotificationMessage={formatNotificationMessage} />
      return (
        <p key={notification.sent_at}>
          Association notification component goes here.
        </p>
      );
    }

    if (money_noti && money_noti[0].length > 0) {
      return (
        <MoneyRaiseNotification
          notification={notification}
          formatNotificationMessage={formatNotificationMessage}
        />
      );
    }

    return null; // Return null if no known notification type matches
  };

  const formatNotificationMessage = (notification) => {
    const senderName =
      notification?.sender_data?.params?.full_name ?? 'Unknown Sender';
    const senderProfilePicture =
      notification?.sender_data?.params?.profile_picture &&
      notification?.sender_data?.params?.profile_picture?.[0]
        ? uint8ArrayToBase64(
            notification?.sender_data?.params?.profile_picture?.[0]
          )
        : '';
    const receiverName =
      notification?.receiver_data?.params?.full_name ?? 'Unknown Receiver';
    const receiverProfilePicture =
      notification?.receiver_data?.params?.profile_picture &&
      notification?.receiver_data?.params?.profile_picture?.[0]
        ? uint8ArrayToBase64(
            notification?.receiver_data?.params?.profile_picture?.[0]
          )
        : '';
    const sentAt = notification && notification?.sent_at;
    const notificationData = notification?.notification_data ?? {};
    console.log('sentAt 1', sentAt);

    if (!notificationData)
      return { message: 'You have a new notification.', type: 'default' };

    if (
      notificationData?.docs_noti &&
      notificationData?.docs_noti?.length > 0
    ) {
      const docsStatus = notificationData?.docs_noti[0][0]?.status;

      return {
        type: 'docs_noti',
        details: {
          status: docsStatus,
          requestType: notificationData?.docs_noti[0][0]?.request_type,
          projectId: notificationData?.docs_noti[0][0]?.project_id,
          sender: {
            name: senderName,
            profilePicture: senderProfilePicture,
          },
          receiver: {
            name: receiverName,
            profilePicture: receiverProfilePicture,
          },
          sentAt: sentAt,
        },
      };
    }

    // Cohort Notification
    if (
      notificationData.cohort_noti &&
      notificationData.cohort_noti.length > 0
    ) {
      return {
        message: `${senderName} wants to join your cohort.`,
        type: 'cohort_noti',
        details: {
          cohort_name: notificationData.cohort_noti[0].cohort_name,
          message: notificationData.cohort_noti[0].message,
          id: notificationData.cohort_noti[0].id,
        },
      };
    }

    // Association Notification
    if (
      notificationData.association_noti &&
      notificationData.association_noti.length > 0
    ) {
      return {
        message: `${senderName} wants to associate with you.`,
        type: 'association_noti',
        details: {
          association_name:
            notificationData.association_noti[0].association_name,
          message: notificationData.association_noti[0].message,
          id: notificationData.association_noti[0].id,
        },
      };
    }

    if (
      notificationData.money_noti &&
      notificationData.money_noti.length > 0 &&
      notificationData.money_noti[0].length > 0
    ) {
      const moneyNoti = notificationData.money_noti[0][0];

      if (moneyNoti) {
        const moneyStatus = moneyNoti.status;
        const senderData = notificationData.sender_data || {};
        const receiverData = notificationData.receiver_data || {};
        const sentAt = notificationData.sent_at;

        return {
          message: `${senderData.name || 'Someone'} is requesting access to fundraising information.`,
          type: 'money_noti',
          details: {
            status: moneyStatus,
            requestType: moneyNoti.request_type,
            projectId: moneyNoti.project_id,
            sender: {
              name: senderData.name || 'Unknown Sender',
              profilePicture: moneyNoti.image
                ? `data:image/png;base64,${Buffer.from(moneyNoti.image).toString('base64')}`
                : null,
            },
            receiver: {
              name: receiverData.name || 'Unknown Receiver',
              profilePicture: receiverData.profilePicture || null, // Adjust based on available data
            },
            sentAt: sentAt, // Convert nanoseconds to milliseconds
          },
        };
      }
    }

    return { message: 'You have a new notification.', type: 'default' };
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
              notificationArray.map((notification) =>
                renderNotification(notification)
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
