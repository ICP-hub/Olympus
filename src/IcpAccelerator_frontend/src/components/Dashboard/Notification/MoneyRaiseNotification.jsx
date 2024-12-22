import React, { useState } from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import toast, { Toaster } from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
const MoneyRaiseNotification = ({
  notification,
  formatNotificationMessage,
}) => {
  const { details } = formatNotificationMessage(notification);
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  const approveAndRejectMonetRaise = async (value, projectId, principal) => {
    if (!actor) {
      console.error('Actor not found');
      return null;
    }

    if (value === 'Approve') setLoadingApprove(true);
    else if (value === 'Decline') setLoadingDecline(true);

    try {
      let result;
      const principalObject = Principal.fromText(principal);

      if (value === 'Approve') {
        result = await actor.approve_money_access_request(
          projectId,
          principalObject
        );
      } else if (value === 'Decline') {
        result = await actor.decline_money_access_request(
          projectId,
          principalObject
        );
      } else {
        console.warn('Unknown action');
        return;
      }

      if (result) {
        toast.success(`Request ${value.toLowerCase()}ed successfully.`);
        // Optional: uncomment if you need to refresh the page or data
        // navigate(0);
      } else {
        toast.error(`Failed to ${value.toLowerCase()} the request.`);
      }
    } catch (error) {
      console.error(`Error processing ${value} request action:`, error);
      toast.error('An error occurred during processing.');
    } finally {
      if (value === 'Approve') setLoadingApprove(false);
      else if (value === 'Decline') setLoadingDecline(false);
    }
  };

  console.log('details in money raise', details);
  const renderStatusButton = (details) => {
    switch (details?.status) {
      case 'pending':
        return (
          <div className='flex space-x-2'>
            <button
              onClick={() =>
                approveAndRejectMonetRaise(
                  'Decline',
                  details?.projectId,
                  details?.senderPrincipal
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
                approveAndRejectMonetRaise(
                  'Approve',
                  details?.projectId,
                  details?.senderPrincipal
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
      case 'approved':
        return (
          <button className='px-3 py-1 text-sm text-white bg-green-500 rounded-md cursor-default'>
            {details?.status}
          </button>
        );
      case 'declined':
        return (
          <button className='px-3 py-1 text-sm text-white bg-red-500 rounded-md cursor-default'>
            {details?.status}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className='flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-4 max-w-full'
      style={{ wordBreak: 'break-word', maxWidth: '100%' }}
    >
      <div className='flex-1 min-w-0'>
        <p
          className='text-sm text-gray-800 mb-1 flex items-center space-x-1 whitespace-normal flex-wrap text-ellipsis'
          style={{ wordBreak: 'break-word' }}
        >
          {details?.status === 'pending' && (
            <div
              className='flex items-start w-full bg-gray-100 p-4 rounded-md'
              style={{ wordBreak: 'break-word', maxWidth: '100%' }}
            >
              <img
                src={details?.sender?.profilePicture}
                alt={`${details?.sender?.name || 'User'}'s avatar`}
                className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                loading='lazy'
                draggable={false}
              />

              <div className='flex'>
                <p className='font-semibold mr-2 break-words text-nowrap'>
                  {details?.sender?.name || 'User'}
                </p>
                <p className='text-sm text-[#4B5565] break-words text-nowrap'>
                  has requested to view the funds raised and total money
                  collected for the project
                </p>
                <div className='flex items-center ml-2'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold break-words text-nowrap'>
                    {details?.receiver?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          )}
          {details?.status === 'approved' && (
            <div
              className='flex items-start w-full bg-gray-100 p-4 rounded-md'
              style={{ wordBreak: 'break-word', maxWidth: '100%' }}
            >
              <img
                src={details?.sender?.profilePicture}
                alt={`${details?.sender?.name || 'User'}'s avatar`}
                className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                loading='lazy'
                draggable={false}
              />

              <div className='flex items-center flex-1'>
                <p className='font-semibold mr-2 break-words'>
                  {details?.sender?.name || 'User'}
                </p>
                <p className='text-sm text-[#4B5565] break-words'>
                  has approved the request to view the funds raised and total
                  money collected for the project
                </p>
                <div className='flex items-center'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold break-words'>
                    {details?.projectName || 'Unknown Project'}
                  </span>
                </div>
              </div>
            </div>
          )}
          {details?.status === 'declined' && (
            <div
              className='flex items-start w-full bg-gray-100 p-4 rounded-md'
              style={{ wordBreak: 'break-word', maxWidth: '100%' }}
            >
              <img
                src={details?.sender?.profilePicture}
                alt={`${details?.sender?.name || 'User'}'s avatar`}
                className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                loading='lazy'
                draggable={false}
              />

              <div className='flex items-center flex-1'>
                <p className='font-semibold mr-2 break-words'>
                  {details?.sender?.name || 'User'}
                </p>
                <p className='text-sm text-[#4B5565] break-words'>
                  has declined the request to view the funds raised and total
                  money collected for the project
                </p>
                <div className='flex items-center'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold break-words'>
                    {details?.projectName || 'Unknown Project'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </p>
        <p className='text-xs text-gray-400 mt-1 whitespace-nowrap ml-4'>
          {timestampAgo(details?.sentAt)}
        </p>
        <div className='mt-2 flex space-x-2 ml-4'>
          {renderStatusButton(details)}
        </div>
      </div>
    </div>
  );
};

export default MoneyRaiseNotification;
