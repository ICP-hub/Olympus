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
    if (details?.status === 'pending') {
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
            className='px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
            disabled={loadingDecline}
          >
            {loadingDecline ? (
              <ThreeDots height='20' width='20' color='#4A5568' />
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
            className='px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'
            disabled={loadingApprove}
          >
            {loadingApprove ? (
              <ThreeDots height='20' width='20' color='#FFFFFF' />
            ) : (
              'Approve'
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
    <div className='flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-4 max-w-full'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-start w-full bg-gray-100 px-4 pt-4 rounded-md'>
          <img
            src={
              details?.sender?.profilePicture ||
              'https://via.placeholder.com/40'
            }
            alt={`${details?.sender?.name || 'User'}'s avatar`}
            className='h-8 w-8 rounded-full flex-shrink-0 mr-2'
            loading='lazy'
            draggable={false}
          />
          <div className='flex flex-1 flex-wrap items-center'>
            <p className='font-semibold break-all w-14 truncate'>
              {details?.sender?.name || 'User'}
            </p>
            <p className='text-sm text-[#4B5565] break-all flex flex-wrap'>
              requests access to the document from
            </p>
          </div>
        </div>
        <div className='flex items-center mt-2'>
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
    </div>
  );
};

export default DocsNotification;
