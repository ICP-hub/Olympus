import React, { useState } from 'react';

const BellIconWithBadge = ({ notificationCount, onClick }) => {
  console.log('line number 4', notificationCount);
  const [checked, setChecked] = useState(false);

  // Handle animation and trigger onClick
  const handleToggle = () => {
    setChecked(!checked);
    if (onClick) onClick(); // Ensures the dropdown opens or any external action happens
  };

  return (
    <div
      className='relative inline-block'
      onClick={handleToggle}
      style={{ cursor: 'pointer' }}
    >
      {/* Bell Icon */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-7 w-7 text-gray-700'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
        style={{
          animation: checked ? 'bell-animation 0.5s ease-in-out' : 'none',
        }}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9'
        />
      </svg>

      {/* Notification Badge */}
      {notificationCount > 0 && (
        <span className='absolute top-0 right-0 flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2'>
          {notificationCount}
        </span>
      )}

      {/* Inline keyframes for animation */}
      <style>
        {`
          @keyframes bell-animation {
            0% { opacity: 0; }
            25% { transform: rotate(25deg); }
            50% { transform: rotate(-20deg) scale(1.2); }
            75% { transform: rotate(15deg); }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default BellIconWithBadge;
