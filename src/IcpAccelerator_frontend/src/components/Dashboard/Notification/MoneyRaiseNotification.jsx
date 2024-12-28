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
              className='px-4 py-1 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50'
              disabled={loadingDecline}
            >
              {loadingDecline ? (
                <ThreeDots
                  visible={true}
                  height='20'
                  width='20'
                  color='#4A5568'
                  ariaLabel='loading-decline'
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
              className='px-4 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50'
              disabled={loadingApprove}
            >
              {loadingApprove ? (
                <ThreeDots
                  visible={true}
                  height='20'
                  width='20'
                  color='#FFFFFF'
                  ariaLabel='loading-approve'
                />
              ) : (
                'Approve'
              )}
            </button>
          </div>
        );
      case 'approved':
        return (
          <button className='px-4 py-1 text-sm text-white bg-green-500 rounded-lg cursor-default'>
            Approved
          </button>
        );
      case 'declined':
        return (
          <button className='px-4 py-1 text-sm text-white bg-red-500 rounded-lg cursor-default'>
            Declined
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className='flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-4 p-6 bg-gray-100 shadow-md rounded-lg mb-4 w-full'
      style={{ wordBreak: 'break-word' }}
    >
      <div className='flex flex-row items-center space-x-4 md:space-x-6 mb-4 md:mb-0'>
        {details?.status === 'pending' ? (
          <>
            <div className='flex-1'>
              <p className='text-sm text-gray-800'>
                <div className='flex'>
                  <img
                    src={
                      details?.sender?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.sender?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.sender?.name || 'User'}
                  </span>
                </div>{' '}
                has requested to view the funds raised for the project{' '}
                <div className='flex items-center space-x-4'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'Recipient'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='text-sm font-semibold text-gray-700'>
                    {details?.receiver?.name || 'Recipient'}
                  </span>
                </div>
              </p>
              <p className='text-xs text-gray-400'>
                {timestampAgo(details?.sentAt)}
              </p>
              <div className='mt-2 flex justify-start'>
                {renderStatusButton(details)}
              </div>
            </div>
          </>
        ) : details?.status === 'approved' ? (
          <>
            <div className='flex-1'>
              <p className='text-sm text-gray-800'>
                <div className='flex'>
                  <img
                    src={
                      details?.sender?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.sender?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.sender?.name || 'User'}
                  </span>
                </div>{' '}
                has requested to view the funds raised for the project{' '}
                <div className='flex items-center space-x-4'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'Recipient'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='text-sm font-semibold text-gray-700'>
                    {details?.receiver?.name || 'Recipient'}
                  </span>
                </div>
                , and the request has been approved.
              </p>
              <p className='text-xs text-gray-400'>
                {timestampAgo(details?.sentAt)}
              </p>
              <div className='mt-2 flex justify-start'>
                {renderStatusButton(details)}
              </div>
            </div>
          </>
        ) : details?.status === 'declined' ? (
          <>
            <div className='flex-1'>
              <p className='text-sm text-gray-800'>
                <div className='flex'>
                  <img
                    src={
                      details?.sender?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.sender?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full mr-2'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.sender?.name || 'User'}
                  </span>
                </div>{' '}
                has requested to view the funds raised for the project{' '}
                <div className='flex items-center space-x-4'>
                  <img
                    src={
                      details?.receiver?.profilePicture ||
                      'https://via.placeholder.com/40'
                    }
                    alt={`${details?.receiver?.name || 'Recipient'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='text-sm font-semibold text-gray-700'>
                    {details?.receiver?.name || 'Recipient'}
                  </span>
                </div>
                , but the request has been declined.
              </p>
              <p className='text-xs text-gray-400'>
                {timestampAgo(details?.sentAt)}
              </p>
              <div className='mt-2 flex justify-start'>
                {renderStatusButton(details)}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MoneyRaiseNotification;
