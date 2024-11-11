import React from 'react';
import timestampAgo from '../../Utils/navigationHelper/timeStampAgo';

const MoneyRaiseNotification = ({
  notification,
  formatNotificationMessage,
}) => {
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
              Fund Project
            </button>
          </div>
        );
      case 'approved':
        return (
          <button className='px-3 py-1 text-sm text-white bg-green-500 rounded-md cursor-default'>
            Funded
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
        <p className='text-sm text-gray-800 mb-1 flex items-center space-x-1 whitespace-nowrap flex-wrap text-ellipsis'>
          {details?.status === 'pending' && (
            <>
              <div className='flex items-center mb-2'>
                <img
                  src={details?.sender?.profilePicture}
                  alt={`${details?.sender?.name || 'User'}'s avatar`}
                  className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.sender?.name}</span>
              </div>
              <span className='mb-2'>
                is requesting funds for the project named
              </span>
              <div className='flex items-center mb-2'>
                <span className='font-semibold'>
                  {details?.projectName || 'Unknown Project'}
                </span>
              </div>
            </>
          )}
          {details?.status === 'approved' && (
            <>
              <div className='flex items-center mb-2'>
                <img
                  src={details?.receiver?.profilePicture}
                  alt={`${details?.receiver?.name || 'User'}'s avatar`}
                  className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.receiver?.name}</span>
              </div>
              <span className='mb-2'>has funded the project named</span>
              <div className='flex items-center mb-2'>
                <span className='font-semibold'>
                  {details?.projectName || 'Unknown Project'}
                </span>
              </div>
            </>
          )}
          {details?.status === 'declined' && (
            <>
              <div className='flex items-center mb-2'>
                <img
                  src={details?.receiver?.profilePicture}
                  alt={`${details?.receiver?.name || 'User'}'s avatar`}
                  className='h-6 w-6 rounded-full flex-shrink-0 mr-2'
                  loading='lazy'
                  draggable={false}
                />
                <span className='font-semibold'>{details?.receiver?.name}</span>
              </div>
              <span className='mb-2'>
                has declined to fund the project named
              </span>
              <div className='flex items-center mb-2'>
                <span className='font-semibold'>
                  {details?.projectName || 'Unknown Project'}
                </span>
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

export default MoneyRaiseNotification;
