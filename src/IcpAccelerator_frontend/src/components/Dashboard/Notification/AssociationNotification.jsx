import React, { useState } from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const AssociationNotification = ({
  notification,
  formatNotificationMessage,
}) => {
  console.log('notification', notification);
  const { data } = formatNotificationMessage(notification);
  console.log('data', data);
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();

  // Loading states for each button
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  function handleNotification(type, name) {
    switch (type) {
      case 'project_to_investor_noti':
        return (
          <span className='block text-sm text-gray-600'>
            association request sent from Project to{' '}
            <span className='font-bold'>{name}</span>.
          </span>
        );
        break;

      case 'project_to_mentor_noti':
        return (
          <span className='block text-sm text-gray-600'>
            association request sent from Project to{' '}
            <span className='font-bold'>{name}</span>.
          </span>
        );
        break;

      case 'mentor_to_project_noti':
        return (
          <span className='block text-sm text-gray-600'>
            association request sent from Mentor to{' '}
            <span className='font-bold'>{name}</span>.
          </span>
        );
        break;

      case 'investor_to_project_noti':
        return (
          <span className='block text-sm text-gray-600'>
            association request sent from Investor to{' '}
            <span className='font-bold'>{name}</span>.
          </span>
        );
        break;

      default:
        console.log('Unknown notification type.');
        // Handle unexpected notification types
        break;
    }
  }

  // const approveAndRejectCohortRequest = async (value, projectId, principal) => {
  //   if (!actor) {
  //     console.log('Actor not found');
  //     return null;
  //   }

  //   if (value === 'Approve') setLoadingApprove(true);
  //   if (value === 'Decline') setLoadingDecline(true);

  //   try {
  //     let result;
  //     switch (value) {
  //       case 'Approve':
  //         result = await actor.approve_enrollment_request(projectId, principal);
  //         break;
  //       case 'Decline':
  //         result = await actor.reject_enrollment_request(projectId, principal);
  //         break;
  //       default:
  //         console.log('Unknown action');
  //         return;
  //     }
  //     if (result) {
  //       toast.success(`Request ${value.toLowerCase()}ed successfully.`);
  //       navigate('/dashboard');
  //     } else {
  //       toast.error(`Failed to ${value.toLowerCase()} the request.`);
  //       navigate('/dashboard');
  //     }
  //   } catch (error) {
  //     console.error('Error processing document request action:', error);
  //     toast.error('An error occurred during processing.');
  //   } finally {
  //     setLoadingApprove(false);
  //     setLoadingDecline(false);
  //   }
  // };

  // const renderStatusButton = (details) => {
  //   if (details?.status === 'pending') {
  //     return (
  //       <div className='flex space-x-2'>
  //         <button
  //           onClick={() =>
  //             approveAndRejectCohortRequest(
  //               'Decline',
  //               details?.cohortCreatorPrincipal,
  //               details?.enrollerPrincipal
  //             )
  //           }
  //           className='px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
  //           disabled={loadingDecline}
  //         >
  //           {loadingDecline ? (
  //             <ThreeDots
  //               visible={true}
  //               height='35'
  //               width='35'
  //               color='#4A5568'
  //               radius='9'
  //               ariaLabel='three-dots-loading'
  //             />
  //           ) : (
  //             'Decline'
  //           )}
  //         </button>
  //         <button
  //           onClick={() =>
  //             approveAndRejectCohortRequest(
  //               'Approve',
  //               details?.cohortId,
  //               details?.enrollerPrincipal
  //             )
  //           }
  //           className='px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'
  //           disabled={loadingApprove}
  //         >
  //           {loadingApprove ? (
  //             <ThreeDots
  //               visible={true}
  //               height='35'
  //               width='35'
  //               color='#FFFFFF'
  //               radius='9'
  //               ariaLabel='three-dots-loading'
  //             />
  //           ) : (
  //             'Accept'
  //           )}
  //         </button>
  //       </div>
  //     );
  //   }
  //   return (
  //     <button
  //       className={`px-3 py-1 text-sm text-white rounded-md cursor-default ${
  //         details?.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
  //       }`}
  //     >
  //       {details?.status}
  //     </button>
  //   );
  // };
  return (
    <div className='flex flex-col space-y-4 p-4 bg-gray-100 shadow-md rounded-lg'>
      {/* User Info */}
      <div className='flex items-center space-x-3'>
        <img
          src={data[0]?.details?.sender?.profilePicture}
          alt={`${data[0]?.details?.sender?.name}`}
          className='h-10 w-10 rounded-full border border-gray-200'
          loading='lazy'
          draggable={false}
        />
        <div>
          <span className='block text-sm font-semibold text-gray-900'>
            {data[0]?.details?.sender?.name}
          </span>
          <span className='block text-sm text-gray-600'>
            {handleNotification(
              data[0]?.type,
              data[0]?.details?.receiver?.name
            )}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className='text-sm text-gray-800 border px-3 py-2'>
        {data[0]?.details?.message ||
          'Hey! I want to contribute to your project as an independent consultant. Check out my profile to get more details or let’s hop on a quick call!'}
      </div>

      {/* Timestamp */}
      <p className='text-xs text-gray-400'>
        {timestampAgo(data[0]?.details?.sentAt)}
      </p>
    </div>
  );
};

export default AssociationNotification;
