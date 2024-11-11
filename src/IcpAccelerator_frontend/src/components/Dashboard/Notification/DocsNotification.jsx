import React from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';

const DocsNotification = ({ notification, formatNotificationMessage }) => {
  const { details } = formatNotificationMessage(notification);

  const renderStatusButton = () => {
    switch (details?.status) {
      case 'pending':
        return (
          <div className='flex space-x-2'>
            <button
              onClick={() => onDecline(details?.projectId)}
              className='px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
            >
              Decline
            </button>
            <button
              onClick={() => onAccept(details?.projectId)}
              className='px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'
            >
              Accept
            </button>
          </div>
        );
      case 'approved':
        return (
          <button className='px-3 py-1 text-sm text-white bg-green-500 rounded-md cursor-default'>
            Accepted
          </button>
        );
      case 'declined':
        return (
          <button className='px-3 py-1 text-sm text-white bg-red-500 rounded-md cursor-default'>
            Declined
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-4 max-w-full'>
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-gray-800 mb-1  items-center space-x-1 whitespace-nowrap text-ellipsis'>
          {details?.status === 'pending' && (
            <>
              <div className='flex flex-wrap items-center mb-2 space-x-2'>
                <img
                  src={details?.sender?.profilePicture}
                  alt={`${details?.sender?.name || 'User'}'s avatar`}
                  className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.sender?.name}</span>
                <span className='mr-1'>
                  requests access to the document from
                </span>
                <div className='flex items-center flex-nowrap'>
                  <img
                    src={details?.receiver?.profilePicture}
                    alt={`${details?.receiver?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.receiver?.name}
                  </span>
                </div>
              </div>
            </>
          )}
          {details?.status === 'accepted' && (
            <>
              <div className='flex flex-wrap items-center mb-2 space-x-2'>
                <img
                  src={details?.receiver?.profilePicture}
                  alt={`${details?.receiver?.name || 'User'}'s avatar`}
                  className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.receiver?.name}</span>
                <span className='mr-1'>has accepted</span>
                <div className='flex items-center flex-nowrap'>
                  <img
                    src={details?.sender?.profilePicture}
                    alt={`${details?.sender?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.sender?.name}'s
                  </span>
                  <span className='mr-2'>request to access the document.</span>
                </div>
              </div>
            </>
          )}
          {details?.status === 'declined' && (
            <>
              <div className='flex flex-wrap items-center mb-2 space-x-2'>
                <img
                  src={details?.receiver?.profilePicture}
                  alt={`${details?.receiver?.name || 'User'}'s avatar`}
                  className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.receiver?.name}</span>
                <span className='mr-1'>has declined</span>
                <div className='flex items-center flex-nowrap'>
                  <img
                    src={details?.sender?.profilePicture}
                    alt={`${details?.sender?.name || 'User'}'s avatar`}
                    className='h-8 w-8 rounded-full flex-shrink-0 mr-1'
                    loading='lazy'
                    draggable={false}
                  />
                  <span className='font-semibold'>
                    {details?.sender?.name}'s
                  </span>
                  <span className='mr-2'>request to access the document.</span>
                </div>
              </div>
            </>
          )}
        </p>
        <p className='text-xs text-gray-400 mt-1 whitespace-nowrap'>
          {timestampAgo(details?.sentAt)}
        </p>
        <div className='mt-2 flex space-x-2'>{renderStatusButton()}</div>
      </div>
    </div>
  );
};

export default DocsNotification;
