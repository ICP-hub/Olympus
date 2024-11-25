import React, { useState } from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';
import toast, { Toaster } from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const DocsNotification = ({ notification, formatNotificationMessage }) => {
  const { details } = formatNotificationMessage(notification);
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();

  // Loading states for each button
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  const approveAndRejectPrivateDocument = async (
    value,
    projectId,
    principal
  ) => {
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
          result = await actor.approve_private_docs_access_request(
            projectId,
            Principal.fromText(principal)
          );
          break;
        case 'Decline':
          result = await actor.decline_private_docs_access_request(
            projectId,
            Principal.fromText(principal)
          );
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
              approveAndRejectPrivateDocument(
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
              approveAndRejectPrivateDocument(
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
        <p className='text-sm text-gray-800 mb-1 items-center space-x-1  text-ellipsis'>
          {details?.status === 'pending' && (
            <div className='flex items-start w-full  bg-gray-100 p-4 rounded-md'>
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

              <div className='flex  flex-wrap items-center flex-1'>
                <p className='font-semibold mr-2 break-words'>
                  {details?.sender?.name || 'User'}
                </p>
                <p className='text-sm text-[#4B5565] break-words'>
                  to requests access to the document from
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
                    {details?.receiver?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </p>
        <p className='text-xs text-gray-400 mt-1 whitespace-nowrap'>
          {timestampAgo(details?.sentAt)}
        </p>
        <div className='mt-2 flex space-x-2'>{renderStatusButton(details)}</div>
      </div>
    </div>
  );
};

export default DocsNotification;
