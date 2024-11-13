import React, { useState } from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const CohortNotification = ({ notification, formatNotificationMessage }) => {
  const { details } = formatNotificationMessage(notification);
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();

  // Loading states for each button
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  const approveAndRejectCohortRequest = async (value, projectId, principal) => {
    if (!actor) {
      console.log('Actor not found');
      return null;
    }

    if (value === 'Approve') setLoadingApprove(true);
    if (value === 'Decline') setLoadingDecline(true);

    try {
      let result;
      switch (value) {
        case 'Approve':
          result = await actor.approve_enrollment_request(projectId, principal);
          break;
        case 'Decline':
          result = await actor.reject_enrollment_request(projectId, principal);
          break;
        default:
          console.log('Unknown action');
          return;
      }
      if (result) {
        toast.success(`Request ${value.toLowerCase()}ed successfully.`);
        navigate('/dashboard');
      } else {
        toast.error(`Failed to ${value.toLowerCase()} the request.`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error processing document request action:', error);
      toast.error('An error occurred during processing.');
    } finally {
      setLoadingApprove(false);
      setLoadingDecline(false);
    }
  };

  const renderStatusButton = (details) => {
    if (details?.status === 'pending') {
      return (
        <div className='flex space-x-2'>
          <button
            onClick={() =>
              approveAndRejectCohortRequest(
                'Decline',
                details?.cohortCreatorPrincipal,
                details?.enrollerPrincipal
              )
            }
            className='px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
            disabled={loadingDecline}
          >
            {loadingDecline ? (
              <ThreeDots
                visible={true}
                height='35'
                width='35'
                color='#4A5568'
                radius='9'
                ariaLabel='three-dots-loading'
              />
            ) : (
              'Decline'
            )}
          </button>
          <button
            onClick={() =>
              approveAndRejectCohortRequest(
                'Approve',
                details?.cohortId,
                details?.enrollerPrincipal
              )
            }
            className='px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'
            disabled={loadingApprove}
          >
            {loadingApprove ? (
              <ThreeDots
                visible={true}
                height='35'
                width='35'
                color='#FFFFFF'
                radius='9'
                ariaLabel='three-dots-loading'
              />
            ) : (
              'Accept'
            )}
          </button>
        </div>
      );
    }
    return (
      <button
        className={`px-3 py-1 text-sm text-white rounded-md cursor-default ${
          details?.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {details?.status}
      </button>
    );
  };

  return (
    <div className='flex flex-col justify-between space-y-4 p-4 bg-gray-100 rounded-lg mb-4 max-w-full'>
      <div className='flex items-center space-x-2 flex-wrap'>
        <img
          src={
            details?.status === 'pending'
              ? details?.sender?.profilePicture
              : details?.receiver?.profilePicture
          }
          alt={`${details?.status === 'pending' ? details?.sender?.name : details?.receiver?.name || 'User'}'s avatar`}
          className='h-8 w-8 rounded-full'
          loading='lazy'
          draggable={false}
        />
        <span className='text-sm font-semibold text-gray-800 text-nowrap'>
          {details?.status === 'pending'
            ? details?.sender?.name
            : details?.receiver?.name || 'Unknown User'}
        </span>
        <span className='text-sm text-gray-800 text-nowrap'>
          {details?.status === 'accepted' && `accepted your invitation to `}
          {details?.status === 'pending' &&
            `has sent you an invitation request for `}
          {details?.status === 'declined' && `declined your invitation to `}
          <span className='font-semibold'>
            {details?.cohortName || 'Untitled Cohort'}
          </span>
        </span>
      </div>
      <p className='text-xs text-gray-400'>{timestampAgo(details?.sentAt)}</p>
      <div className='mt-2 flex justify-start'>
        {renderStatusButton(details)}
      </div>
    </div>
  );
};

export default CohortNotification;
