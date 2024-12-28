import React, { useState } from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import toast from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const DocsNotification = ({ notification, formatNotificationMessage }) => {
  const { details } = formatNotificationMessage(notification);
  const actor = useSelector((state) => state.actors.actor);
  const navigate = useNavigate();

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  const handleAction = async (action, projectId, principal) => {
    if (!actor) {
      console.error('Actor not found');
      return;
    }

    if (action === 'Approve') setLoadingApprove(true);
    if (action === 'Decline') setLoadingDecline(true);

    try {
      const principalInstance = Principal.fromText(principal);
      const actionMethod =
        action === 'Approve'
          ? actor.approve_private_docs_access_request
          : actor.decline_private_docs_access_request;

      const result = await actionMethod(projectId, principalInstance);

      if (result) {
        toast.success(`Request ${action.toLowerCase()}ed successfully.`);
        navigate('/dashboard');
      } else {
        toast.error(`Failed to ${action.toLowerCase()} the request.`);
      }
    } catch (error) {
      console.error('Error processing action:', error);
      toast.error('An error occurred while processing the request.');
    } finally {
      setLoadingApprove(false);
      setLoadingDecline(false);
    }
  };

  const renderStatusButton = (details) => {
    switch (details?.status) {
      case 'pending':
        return (
          <div className='flex space-x-2'>
            <button
              onClick={() =>
                handleAction(
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
                handleAction(
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

  const renderNotificationDetails = (status) => (
    <div className='flex-1 min-w-0'>
      <div className='flex items-start w-full bg-gray-100 px-4 pt-4 rounded-md'>
        <img
          src={
            details?.sender?.profilePicture || 'https://via.placeholder.com/40'
          }
          alt={`${details?.sender?.name || 'User'}'s avatar`}
          className='h-8 w-8 rounded-full flex-shrink-0 mr-2'
          loading='lazy'
          draggable={false}
        />
        <div className='flex flex-1 flex-wrap items-center'>
          <p className='font-semibold break-all text-nowrap'>
            {details?.sender?.name || 'User'}
          </p>
          <p className='text-sm text-[#4B5565] break-all flex flex-wrap ml-2'>
            {status === 'pending'
              ? ' requests access to the document from'
              : status === 'approved'
                ? ' requests access of the document has been approved by'
                : ' requests access of the document has been declined by'}
          </p>
        </div>
      </div>
      <div className='flex items-center ml-3'>
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
        <span className='font-semibold break-all line-clamp-1 truncate'>
          {details?.receiver?.name || 'User'}
        </span>
      </div>
      <p className='text-xs text-gray-400 mt-1 whitespace-nowrap ml-4'>
        {timestampAgo(details?.sentAt)}
      </p>
      <div className='mt-2 flex space-x-2 ml-4'>
        {renderStatusButton(details)}
      </div>
    </div>
  );

  return (
    <div className='flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-4 max-w-full'>
      {details?.status && renderNotificationDetails(details?.status)}
    </div>
  );
};

export default DocsNotification;
