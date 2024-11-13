import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mentor from '../../../../assets/Logo/talent.png';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import DocsNotification from './DocsNotification';
import MoneyRaiseNotification from './MoneyRaiseNotification';
import CohortNotification from './CohortNotification';

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

  const renderNotification = (notification, index) => {
    const { docs_noti, cohort_noti, association_noti, money_noti } =
      notification.notification_data || {};

    // Switch statement to handle different notification types
    switch (true) {
      case docs_noti && docs_noti[0].length > 0:
        return (
          <DocsNotification
            notification={notification}
            formatNotificationMessage={formatNotificationMessage}
            key={index}
          />
        );

      case cohort_noti && cohort_noti[0].length > 0:
        return (
          <CohortNotification
            notification={notification}
            formatNotificationMessage={formatNotificationMessage}
            key={index}
          />
        );

      case association_noti && association_noti[0].length > 0:
        // Replace with AssociationNotification component when ready
        return <p key={index}>Association notification component goes here.</p>;

      case money_noti && money_noti[0].length > 0:
        return (
          <MoneyRaiseNotification
            notification={notification}
            formatNotificationMessage={formatNotificationMessage}
            key={index}
          />
        );

      default:
        return null; // Return null if no matching notification type
    }
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
    console.log('notificationData', notificationData);

    if (!notificationData) {
      return { message: 'You have a new notification.', type: 'default' };
    }

    let type = 'default';

    if (
      notificationData?.docs_noti &&
      notificationData?.docs_noti[0]?.length > 0
    ) {
      type = 'docs_noti';
    } else if (
      notificationData?.cohort_noti &&
      notificationData?.cohort_noti[0]?.length > 0
    ) {
      type = 'cohort_noti';
    } else if (
      notificationData?.association_noti &&
      notificationData?.association_noti[0]?.length > 0
    ) {
      type = 'association_noti';
    } else if (
      notificationData?.money_noti &&
      notificationData?.money_noti[0]?.length > 0
    ) {
      type = 'money_noti';
    }
    console.log('typt', type);

    switch (type) {
      case 'docs_noti':
        const docsNoti = notificationData.docs_noti[0][0] || {};
        return {
          type: 'docs_noti',
          details: {
            status: docsNoti?.status,
            requestType: docsNoti?.request_type,
            projectId: docsNoti?.project_id,
            senderPrincipal: docsNoti?.sender.toText(),
            sender: {
              name: docsNoti.name ?? senderName,
              profilePicture: docsNoti.image
                ? uint8ArrayToBase64(docsNoti.image)
                : senderProfilePicture,
            },
            receiver: {
              name: receiverName,
              profilePicture: receiverProfilePicture,
            },
            sentAt: sentAt,
          },
        };

      case 'cohort_noti':
        const CohortNoti = notificationData.cohort_noti[0][0] || {};
        console.log('CohortNoti', CohortNoti);
        return {
          type: 'cohort_noti',
          details: {
            status: CohortNoti?.request_status,
            cohortName: CohortNoti?.cohort_details?.cohort?.title,
            cohortId: CohortNoti?.cohort_details?.cohort_id,
            cohortCreatorPrincipal:
              CohortNoti?.cohort_details?.cohort_creator_principal,
            enrollerPrincipal: CohortNoti?.enroller_principal,
            sender: {
              name:
                CohortNoti.enroller_data?.user_data[0]?.params?.full_name ??
                senderName,
              profilePicture: CohortNoti.enroller_data?.user_data[0]?.params
                ?.profile_picture[0]
                ? uint8ArrayToBase64(
                    CohortNoti.enroller_data?.user_data[0]?.params
                      ?.profile_picture[0]
                  )
                : senderProfilePicture,
            },
            receiver: {
              name:
                CohortNoti?.cohort_details?.cohort_creator_data?.full_name ??
                receiverName,
              profilePicture: CohortNoti?.cohort_details?.cohort_creator_data
                ?.profile_picture[0]
                ? uint8ArrayToBase64(
                    CohortNoti?.cohort_details?.cohort_creator_data
                      ?.profile_picture[0]
                  )
                : receiverProfilePicture,
            },
            sentAt: sentAt,
          },
        };

      case 'association_noti':
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

      case 'money_noti':
        const moneyNoti = notificationData.money_noti[0]?.[0] || {};
        console.log('moneyNoti in formatNotificationMessage:', moneyNoti);
        return {
          type: 'money_noti',
          details: {
            status: moneyNoti.status ?? 'unknown',
            requestType: moneyNoti.request_type ?? 'unknown',
            projectId: moneyNoti.project_id ?? 'unknown',
            senderPrincipal: moneyNoti?.sender.toText(),
            sender: {
              name: moneyNoti.name ?? senderName,
              profilePicture: moneyNoti.image
                ? uint8ArrayToBase64(moneyNoti.image)
                : senderProfilePicture,
            },
            receiver: {
              name: receiverName,
              profilePicture: receiverProfilePicture,
            },
            sentAt,
          },
        };

      default:
        return { message: 'You have a new notification.', type: 'default' };
    }
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
              notificationArray.map((notification, index) =>
                renderNotification(notification, index)
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
