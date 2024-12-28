import React from 'react';
import { useLocation } from 'react-router-dom';
import uint8ArrayToBase64 from '../../Utils/uint8ArrayToBase64';
import DocsNotification from './DocsNotification';
import MoneyRaiseNotification from './MoneyRaiseNotification';
import CohortNotification from './CohortNotification';
import AssociationNotification from './AssociationNotification';
import NoData from '../../NoDataCard/NoData';

export default function DashboardNotification() {
  const location = useLocation();
  const { notifications } = location.state || {};

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
        return (
          <AssociationNotification
            notification={notification}
            formatNotificationMessage={formatNotificationMessage}
            key={index}
          />
        );

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
  function mapNotifications(notificationData, type) {
    // Get the array of notifications for the given type
    const notifications = notificationData[type] || [];

    // Map each notification in the array to a standardized structure
    return notifications.map((notification) => {
      const sender = notification.sender_data?.[0]?.[1] || {};
      const receiver = notification.reciever_data?.[0]?.[1] || {};

      return {
        type: type,
        details: {
          message: notification.offer || '',
          sender: {
            name: sender?.params?.full_name || 'Unknown Sender',
            profilePicture: sender?.params?.profile_picture[0]
              ? uint8ArrayToBase64(sender?.params?.profile_picture[0])
              : 'defaultSenderPicUrl',
          },
          receiver: {
            name: receiver?.params?.full_name || 'Unknown Receiver',
            profilePicture: receiver?.params?.profile_picture[0]
              ? uint8ArrayToBase64(receiver?.params?.profile_picture[0])
              : 'defaultReceiverPicUrl',
          },
          sentAt: notification.sent_at || null,
        },
      };
    });
  }

  const allNotificationTypes = [
    'project_to_investor_noti',
    'project_to_mentor_noti',
    'mentor_to_project_noti',
    'investor_to_project_noti',
  ];

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
            senderPrincipal: docsNoti?.sender,
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
        const AssociationNoti = notificationData.association_noti[0][0] || {};
        console.log('AssociationNoti', AssociationNoti);
        const mappedNotifications = allNotificationTypes.flatMap((type) =>
          mapNotifications(AssociationNoti, type)
        );
        console.log('mappedNotifications', mappedNotifications);
        return {
          type: 'association_noti',
          data: mappedNotifications,
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
            senderPrincipal: moneyNoti?.sender,
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
    <div className='bg-white rounded-lg w-full h-full flex flex-col'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-3xl font-bold'>Notifications</h2>
      </div>

      <div className='flex-grow overflow-y-auto'>
        <div className='p-4 space-y-6'>
          {Array.isArray(notificationArray) &&
          notificationArray.length === 0 ? (
            <div className='flex justify-center'>
              <NoData message={'No notification available ..'} />
            </div>
          ) : (
            notificationArray.map((notification, index) =>
              renderNotification(notification, index)
            )
          )}
        </div>
      </div>
    </div>
  );
}
