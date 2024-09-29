import React from 'react';

const NotificationBanner = ({ message, onDismiss }) => {
  return (
    <div className='flex items-center justify-between p-4 bg-yellow-100 border border-yellow-200 rounded mx-[3%] my-7'>
      <div className='flex items-center'>
        <span className='text-yellow-700 font-medium'>
          ⚠️ Your project is being reviewed.
        </span>
        <span className='ml-2 text-gray-600'>{message}</span>
      </div>
      <button
        className='text-gray-700 border border-gray-300 rounded px-4 py-1 hover:bg-gray-200'
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
};

export default NotificationBanner;
